<div align="center">

# sigil.app — Website

**Marketing and transparency site for Sigil wallet**

[![Deploy](https://img.shields.io/github/deployments/sigil-oss/sigil.site/production?style=flat-square&label=deploy&color=0d0d0d&labelColor=1a1a1a)](https://sigil.app)

[sigil.app](https://sigil.app)

</div>

---

The public website for [Sigil](https://github.com/sigil-oss/sigil.app) — download page, docs, and sponsor transparency.

Built with [TanStack Start](https://tanstack.com/start), React, and Tailwind CSS.

## Routes

| Route | Description |
|---|---|
| `/` | Landing page |
| `/download` | Platform download links |
| `/docs` | Deep-link protocol documentation |
| `/sponsors` | Donation transparency |

## Development

```bash
bun install
bun run dev
```

## Build

```bash
bun run build
node dist/server/index.mjs
```

Output is a self-contained Node server. Deploy to any Node-compatible host (Render, Fly.io, VPS, etc.).

## Stack

- [TanStack Start](https://tanstack.com/start) — full-stack React framework
- [TanStack Router](https://tanstack.com/router) — file-based routing
- [Tailwind CSS](https://tailwindcss.com/) — styling
- [Nitro](https://nitro.build/) — server adapter
