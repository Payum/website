import {
  ADOPTERS,
  DOCS_URL,
  FACTS,
  FEATURE_GROUPS,
  FRAMEWORK_NAMES,
  FRAMEWORK_SNIPPETS,
  GATEWAYS,
  GATEWAYS_DOCS_URL,
  GET_STARTED_URL,
  GITHUB_URL,
  HERO_GATEWAYS,
  HERO_HEAD,
  HERO_TAIL,
  INTEGRATIONS_DOCS_URL,
  OMNIPAY_URL,
  PIPELINE,
  RELEASE,
  STATUSES
} from '~/utils/landing'

/**
 * The markdown representation of `/`, built from the same `app/utils/landing.ts`
 * data the Vue components render. Generating from the source of truth rather
 * than converting the rendered HTML means no scraping, no layout noise, and no
 * drift — a copy edit lands in both representations at once.
 */
export function renderLandingMarkdown(title: string, description: string): string {
  const hero = HERO_GATEWAYS[0]

  return [
    '---',
    `title: ${title}`,
    `description: ${description}`,
    '---',
    '',
    '# One API. Every gateway.',
    '',
    description,
    '',
    `Payum ${RELEASE.version} · PHP ${RELEASE.php} · ${RELEASE.licence} · ${RELEASE.installs} installs · ${RELEASE.stars} stars · released ${RELEASE.released}`,
    '',
    section('At a glance', [
      table(['Fact', 'Value'], FACTS.map(f => [f.label, f.value]))
    ]),
    section('Getting started', [
      'Swapping the tinted block below is the only change needed to move between processors — the payment, the token and the redirect are identical for every one of them.',
      '',
      code('php', `${HERO_HEAD}\n${hero?.block ?? ''}\n${HERO_TAIL}`)
    ]),
    section('Framework integration', FRAMEWORK_NAMES.flatMap((name) => {
      const snippet = FRAMEWORK_SNIPPETS[name]
      return [
        `### ${name}`,
        '',
        `${snippet.noteTitle} — ${snippet.note}`,
        '',
        code('bash', snippet.install),
        '',
        `\`${snippet.file}\``,
        '',
        code(langFor(snippet.file), snippet.code)
      ]
    })),
    ...FEATURE_GROUPS.map(group => section(group.heading, group.features.flatMap(f => [
      `### ${f.title}`,
      '',
      f.body,
      ''
    ]))),
    section('How a payment flows', [
      PIPELINE.map(p => `${Number(p.step)}. ${p.text}`).join('\n')
    ]),
    section('Payment statuses', [
      table(['Status', 'Meaning'], STATUSES.map(s => [`\`${s.code}\``, s.text]))
    ]),
    section('Supported gateways', [
      `The ${GATEWAYS.length} listed on the site. Payum also wraps any other processor as a custom gateway, using the same request objects.`,
      '',
      GATEWAYS.join(', ') + '.',
      '',
      `Full list with package names: ${GATEWAYS_DOCS_URL}`
    ]),
    section('Built on Payum', [ADOPTERS.join(', ') + '.']),
    section('Links', [
      [
        `- Get started: ${GET_STARTED_URL}`,
        `- Documentation: ${DOCS_URL}`,
        `- Framework and e-commerce integrations: ${INTEGRATIONS_DOCS_URL}`,
        `- Payum compared to Omnipay: ${OMNIPAY_URL}`,
        `- Source: ${GITHUB_URL}`
      ].join('\n')
    ])
  ].join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n'
}

/**
 * Rough token estimate for the `x-markdown-tokens` header. The spec asks for a
 * count "if available"; a ~4-chars-per-token approximation is honest for
 * context-window budgeting without shipping a tokenizer to do it exactly.
 */
export function estimateTokens(markdown: string): number {
  return Math.ceil(markdown.length / 4)
}

function section(heading: string, body: string[]): string {
  return `\n## ${heading}\n\n${body.join('\n')}\n`
}

function code(lang: string, body: string): string {
  return `\`\`\`${lang}\n${body}\n\`\`\``
}

function table(headers: string[], rows: string[][]): string {
  return [
    `| ${headers.join(' | ')} |`,
    `| ${headers.map(() => '---').join(' | ')} |`,
    ...rows.map(cells => `| ${cells.join(' | ')} |`)
  ].join('\n')
}

function langFor(file: string): string {
  if (file.endsWith('.yaml') || file.endsWith('.yml')) return 'yaml'
  if (file.endsWith('.json')) return 'json'
  return 'php'
}
