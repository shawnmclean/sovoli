# Sovoli

WIP: nothing here to see, pls leave.

### Development

Setup the environment variables:

### Tiptap Pro

```bash
echo 'export NPM_CONFIG_TIPTAP_PRO_TOKEN={token}' >> ~/.bash_profile
source ~/.bash_profile
```

```powershell
$env:NPM_CONFIG_TIPTAP_PRO_TOKEN="{token}"; [Environment]::SetEnvironmentVariable("NPM_CONFIG_TIPTAP_PRO_TOKEN", $env:NPM_CONFIG_TIPTAP_PRO_TOKEN, "User")
```

See: https://cloud.tiptap.dev/v1/pro-extensions

#### WebApp

- Framework: [Next.js](https://nextjs.org/)
- Media Storage: [Cloudinary](https://cloudinary.com/)
- Database: [Supabas Postgres](https://supabase.com/)
- LLM: [OpenAI](https://openai.com/), [Gemini](https://gemini.google.com/)

Some links:

- Data fetching: use the cache with server-only preload pattern: https://nextjs.org/docs/app/building-your-application/data-fetching/fetching#using-react-cache-and-server-only-with-the-preload-pattern

