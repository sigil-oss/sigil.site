import { createFileRoute } from "@tanstack/react-router";
import { CodeBlock } from "#/components/CodeBlock";
import { hl } from "#/lib/shiki";

const INSTALL = `npm install @sigil-oss/connect`;

const USE_SIGIL = `// composables/useSigil.ts
import { ref } from 'vue';
import {
  sigilRequest,
  type SigilRequest,
  type SigilCallbackResponse,
} from '@sigil-oss/connect';

type Status = 'idle' | 'pending' | 'success' | 'error';

export function useSigil() {
  const status = ref<Status>('idle');
  const result = ref<SigilCallbackResponse | null>(null);
  const error = ref<Error | null>(null);
  let pending = false;

  async function request(req: SigilRequest) {
    if (pending) throw new Error('A Sigil request is already in progress');
    pending = true;
    status.value = 'pending';
    result.value = null;
    error.value = null;

    try {
      const res = await sigilRequest(req);
      result.value = res;
      status.value = 'success';
      return res;
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err));
      status.value = 'error';
      throw error.value;
    } finally {
      pending = false;
    }
  }

  function reset() {
    status.value = 'idle';
    result.value = null;
    error.value = null;
  }

  return { request, status, result, error, reset };
}`;

const CALLBACK_COMPONENT = `<!-- components/SigilCallback.vue -->
<script setup lang="ts">
import { onMounted } from 'vue';
import { handleRedirect } from '@sigil-oss/connect';

onMounted(() => {
  handleRedirect(); // reads ?result=, broadcasts, closes tab
});
</script>

<template>
  <!-- tab closes itself — nothing to render -->
</template>`;

const VUE_ROUTER = `// router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import SigilCallback from '@/components/SigilCallback.vue';
import Home from '@/views/Home.vue';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: Home },
    { path: '/__sigil__', component: SigilCallback },
    // … rest of your routes
  ],
});`;

const NUXT_PAGE = `<!-- pages/__sigil__.vue — Nuxt auto-routing picks this up -->
<script setup lang="ts">
import { onMounted } from 'vue';
import { handleRedirect } from '@sigil-oss/connect';

onMounted(() => {
  handleRedirect();
});
</script>

<template><!-- closes itself --></template>`;

const CONNECT_COMPONENT = `<!-- components/ConnectButton.vue -->
<script setup lang="ts">
import { createConnectRequest } from '@sigil-oss/connect';
import { useSigil } from '@/composables/useSigil';

const emit = defineEmits<{ connected: [identity: string] }>();
const { request, status, result, reset } = useSigil();

async function connect() {
  const res = await request(
    createConnectRequest({
      type: 'connect',
      dapp: { name: 'My App', origin: 'https://myapp.example' },
      permissions: ['transfer', 'sign_message'],
    })
  );
  if (res.status === 'connected') emit('connected', res.identity);
}
</script>

<template>
  <div v-if="status === 'success' && result?.status === 'connected'">
    <p>Connected: {{ result.identity.slice(0, 8) }}…</p>
    <button @click="reset">Disconnect</button>
  </div>
  <button v-else @click="connect" :disabled="status === 'pending'">
    {{ status === 'pending' ? 'Opening Sigil…' : 'Connect Wallet' }}
  </button>
</template>`;

const SIGN_IN_COMPONENT = `<!-- components/SignInButton.vue -->
<script setup lang="ts">
import { createSignMessageRequest } from '@sigil-oss/connect';
import { useSigil } from '@/composables/useSigil';

const emit = defineEmits<{ signedIn: [identity: string] }>();
const { request, status, error } = useSigil();

async function signIn() {
  const nonce = crypto.randomUUID();

  const res = await request(
    createSignMessageRequest({
      type: 'sign_message',
      dapp: { name: 'My App', origin: 'https://myapp.example' },
      message: [\`Sign in to My App\`, \`nonce: \${nonce}\`, \`issuedAt: \${new Date().toISOString()}\`].join('\\n'),
    })
  );

  if (res.status !== 'signed' || res.type !== 'sign_message') return;

  const response = await fetch('/api/auth/qubic', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      identity: res.identity,
      signature: res.signature,
      public_key: res.public_key,
      nonce,
    }),
  });

  if (response.ok) emit('signedIn', res.identity);
}
</script>

<template>
  <button @click="signIn" :disabled="status === 'pending'">
    {{ status === 'pending' ? 'Waiting for Sigil…' : 'Sign in with Qubic' }}
  </button>
  <p v-if="error" style="color: red">{{ error.message }}</p>
</template>`;

const TRANSFER_COMPONENT = `<!-- components/TransferButton.vue -->
<script setup lang="ts">
import { createTransferRequest } from '@sigil-oss/connect';
import { useSigil } from '@/composables/useSigil';

const props = defineProps<{ to: string; amount: number }>();
const emit = defineEmits<{ sent: [txHash: string] }>();
const { request, status, result } = useSigil();

async function send() {
  const res = await request(
    createTransferRequest({
      type: 'transfer',
      dapp: { name: 'My App', origin: 'https://myapp.example' },
      to: props.to,
      amount: props.amount,
    })
  );
  if (res.status === 'signed' && (res.type === 'transfer' || res.type === 'sc_call')) emit('sent', res.tx_hash);
}
</script>

<template>
  <p v-if="status === 'success' && result?.status === 'signed' && (result.type === 'transfer' || result.type === 'sc_call')">
    Sent — tx: {{ result.tx_hash.slice(0, 12) }}…
  </p>
  <button v-else @click="send" :disabled="status === 'pending'">
    {{ status === 'pending' ? 'Waiting for Sigil…' : \`Send \${amount.toLocaleString()} QU\` }}
  </button>
</template>`;

export const Route = createFileRoute("/docs/vue")({
	head: () => ({
		meta: [
			{ title: "Sigil Docs — Vue 3 Integration" },
			{
				name: "description",
				content:
					"Integrate Sigil into a Vue 3 app: useSigil composable, Vue Router and Nuxt.js callback setup, connect, sign-in, and transfer components.",
			},
		],
	}),
	loader: async () => {
		const [
			installHtml,
			composableHtml,
			callbackHtml,
			vueRouterHtml,
			nuxtHtml,
			connectHtml,
			signInHtml,
			transferHtml,
		] = await Promise.all([
			hl(INSTALL, "bash"),
			hl(USE_SIGIL, "typescript"),
			hl(CALLBACK_COMPONENT, "html"),
			hl(VUE_ROUTER, "typescript"),
			hl(NUXT_PAGE, "html"),
			hl(CONNECT_COMPONENT, "html"),
			hl(SIGN_IN_COMPONENT, "html"),
			hl(TRANSFER_COMPONENT, "html"),
		]);
		return {
			installHtml,
			composableHtml,
			callbackHtml,
			vueRouterHtml,
			nuxtHtml,
			connectHtml,
			signInHtml,
			transferHtml,
		};
	},
	component: VuePage,
});

function VuePage() {
	const {
		installHtml,
		composableHtml,
		callbackHtml,
		vueRouterHtml,
		nuxtHtml,
		connectHtml,
		signInHtml,
		transferHtml,
	} = Route.useLoaderData();

	return (
		<div className="docs-content">
			<div className="docs-eyebrow">[ GUIDES ]</div>
			<h1>Vue 3</h1>
			<p>
				Vue 3 Composition API integration with a reusable{" "}
				<code className="inline">useSigil</code> composable and ready-to-use
				single-file components. Works with Vue Router and Nuxt.
			</p>

			<h2 id="install">Install</h2>
			<CodeBlock html={installHtml} label="TERMINAL" />

			<h2 id="composable">useSigil composable</h2>
			<p>
				Drop this in <code className="inline">composables/useSigil.ts</code>.
				Returns reactive <code className="inline">status</code>,{" "}
				<code className="inline">result</code>, and{" "}
				<code className="inline">error</code> refs alongside the{" "}
				<code className="inline">request()</code> function.
			</p>
			<CodeBlock html={composableHtml} label="composables/useSigil.ts" />

			<h2 id="callback-route">Callback route</h2>
			<p>
				Register a route at <code className="inline">/__sigil__</code> that
				renders the callback component. It calls{" "}
				<code className="inline">handleRedirect()</code> on mount and closes the
				tab after broadcasting the result.
			</p>
			<CodeBlock html={callbackHtml} label="components/SigilCallback.vue" />

			<h3 id="vue-router">Vue Router</h3>
			<CodeBlock html={vueRouterHtml} label="router/index.ts" />

			<h3 id="nuxt">Nuxt</h3>
			<p>
				Create a page file at{" "}
				<code className="inline">pages/__sigil__.vue</code> — Nuxt's file-based
				routing picks it up automatically.
			</p>
			<CodeBlock html={nuxtHtml} label="pages/__sigil__.vue" />

			<h2 id="connect">Connect wallet</h2>
			<CodeBlock html={connectHtml} label="components/ConnectButton.vue" />

			<h2 id="sign-in">Sign in with Qubic</h2>
			<CodeBlock html={signInHtml} label="components/SignInButton.vue" />

			<h2 id="transfer">Request a transfer</h2>
			<CodeBlock html={transferHtml} label="components/TransferButton.vue" />
		</div>
	);
}
