/** Content for the landing page, kept out of the templates so copy edits
 *  don't mean touching markup. Mirrors the design's `renderVals()`. */

export const DOCS_URL = 'https://docs.payum.dev/'
/** The first-hour path, not the docs root. A "read the docs" action that lands
 *  on a table of contents makes the visitor do the routing themselves. */
export const GET_STARTED_URL = 'https://docs.payum.dev/get-it-started'
/** The project's own Omnipay comparison — first-party, so it can be cited
 *  rather than paraphrased into claims of our own. */
export const OMNIPAY_URL = 'https://docs.payum.dev/payum-vs-omnipay'
export const GATEWAYS_DOCS_URL = 'https://docs.payum.dev/supported-gateways'
export const INTEGRATIONS_DOCS_URL = 'https://docs.payum.dev/frameworks-and-e-commerce-integration'
export const GITHUB_URL = 'https://github.com/Payum/Payum'
export const PACKAGIST_URL = 'https://packagist.org/packages/payum/payum'
export const RELEASES_URL = 'https://github.com/Payum/Payum/releases'

/** Liveness facts. Verified against Packagist and github.com/Payum/Payum on
 *  2026-08-11 — re-check before a deploy, they move. Figures are rounded DOWN
 *  so they stay true as the real numbers grow. */
export const RELEASE = {
  version: '1.7.7',
  php: '8.1+',
  licence: 'MIT',
  installs: '6.8M',
  stars: '1.9k',
  dependents: '25',
  released: '2025-12-24'
}

/** Downstream projects that build on Payum, from Packagist's dependents list.
 *  Only ecosystem packages — Payum has no cleared end-user company names. */
export const ADOPTERS = ['Sylius', 'CoreShop']

/** One key/value pair in the manifest strip under the hero. Each links to the
 *  source it came from — a sceptical reader verifies rather than trusts, and a
 *  link can't go stale the way a hardcoded number can. */
export interface Fact {
  label: string
  value: string
  href: string
}

export interface Feature {
  title: string
  body: string
}

/** Six flat term/definition pairs read as an undifferentiated list. They split
 *  cleanly along the line the product itself draws: the contract you code
 *  against, and the parts it refuses to lock you into. */
export interface FeatureGroup {
  heading: string
  features: Feature[]
}

export interface PipelineStep {
  step: string
  text: string
}

export interface PaymentStatus {
  code: string
  text: string
  /** Lifecycle phase, not a good/bad verdict — a refund is a completed
   *  movement, not a failure, and a cancel is not an error. */
  tone: 'new' | 'pending' | 'settled' | 'ended'
}

export type FrameworkName = 'Symfony' | 'Laravel' | 'Laminas' | 'Plain PHP'

export interface FrameworkSnippet {
  file: string
  noteTitle: string
  note: string
  install: string
  code: string
}

/** The hero snippet, split so the gateway block can be swapped in place.
 *
 *  The gateway is keyed `'checkout'` rather than `'stripe'` on purpose: the key
 *  is the developer's own name for the slot, so naming it after the role rather
 *  than the vendor is what lets the processor change without touching a single
 *  call site. That is also what makes the demonstration honest — swapping the
 *  block below changes nothing else in the file, including the token line. */
export const HERO_HEAD = `use Payum\\Core\\PayumBuilder;

$payum = (new PayumBuilder())
    ->addDefaultStorages()`

export const HERO_TAIL = `    ->getPayum();

$payment = $payum->getStorage(Payment::class)->create();
$payment->setTotalAmount(4200);
$payment->setCurrencyCode('EUR');

$token = $payum->getTokenFactory()
    ->createCaptureToken('checkout', $payment, 'done.php');`

export interface HeroGateway {
  name: string
  block: string
}

/** Only factories that already appear verbatim elsewhere on this page, so the
 *  swapper cannot put a gateway name on screen that isn't real. Every block is
 *  four lines, so the code underneath never moves. */
export const HERO_GATEWAYS: HeroGateway[] = [
  {
    name: 'Stripe',
    block: `    ->addGateway('checkout', [
        'factory'    => 'stripe_checkout',
        'secret_key' => $_ENV['STRIPE_SECRET'],
    ])`
  },
  {
    name: 'PayPal',
    block: `    ->addGateway('checkout', [
        'factory'  => 'paypal_express_checkout',
        'username' => $_ENV['PAYPAL_USERNAME'],
    ])`
  },
  {
    name: 'Be2Bill',
    block: `    ->addGateway('checkout', [
        'factory'    => 'be2bill_offsite',
        'identifier' => $_ENV['BE2BILL_IDENTIFIER'],
    ])`
  },
  {
    name: 'Offline',
    block: `    ->addGateway('checkout', [
        'factory' => 'offline',
        // settled by hand: nothing to authenticate against
    ])`
  }
]

export const FRAMEWORK_NAMES: FrameworkName[] = ['Symfony', 'Laravel', 'Laminas', 'Plain PHP']

export const FRAMEWORK_SNIPPETS: Record<FrameworkName, FrameworkSnippet> = {
  'Symfony': {
    file: 'config/packages/payum.yaml',
    noteTitle: 'PayumBundle',
    note: 'Gateways become container services. The bundle registers capture, notify, authorize and refund routes for you — you only build the token and redirect.',
    install: 'composer require payum/payum-bundle',
    code: `payum:
    security:
        token_storage:
            App\\Entity\\PaymentToken: { doctrine: { driver: orm } }

    storages:
        App\\Entity\\Payment: { doctrine: { driver: orm } }

    gateways:
        stripe:
            factory: stripe_checkout
            secret_key: '%env(STRIPE_SECRET)%'

        paypal:
            factory: paypal_express_checkout
            username: '%env(PAYPAL_USERNAME)%'
            sandbox: false`
  },
  'Laravel': {
    file: 'config/payum.php',
    noteTitle: 'Payum for Laravel',
    note: 'Publish the config, resolve Payum from the container, and use Eloquent or Doctrine models as payment storage. Routes ship as a service provider.',
    install: 'composer require payum/payum-laravel-package',
    code: `return [
    'storage' => [
        'payment' => ['eloquent' => App\\Models\\Payment::class],
    ],

    'gateways' => [
        'paypal' => [
            'factory'   => 'paypal_express_checkout',
            'username'  => env('PAYPAL_USERNAME'),
            'password'  => env('PAYPAL_PASSWORD'),
            'signature' => env('PAYPAL_SIGNATURE'),
            'sandbox'   => env('PAYPAL_SANDBOX', true),
        ],
    ],
];

Route::get('/checkout/{order}', CheckoutController::class);`
  },
  'Laminas': {
    file: 'config/autoload/payum.global.php',
    noteTitle: 'Payum module',
    note: 'Drop the module into your application config. Gateway factories are resolved through the Laminas service manager like any other service.',
    install: 'composer require payum/payum-module',
    code: `return [
    'payum' => [
        'gateways' => [
            'be2bill' => [
                'factory'    => 'be2bill_offsite',
                'identifier' => getenv('BE2BILL_IDENTIFIER'),
                'password'   => getenv('BE2BILL_PASSWORD'),
            ],
        ],

        'storages' => [
            Application\\Entity\\Payment::class => [
                'filesystem' => ['storage_dir' => 'data/payments'],
            ],
        ],
    ],
];`
  },
  'Plain PHP': {
    file: 'checkout.php',
    noteTitle: 'No framework required',
    note: 'PayumBuilder gives you the whole library in a single expression — useful for legacy apps, workers, and CLI tooling.',
    install: 'composer require payum/payum',
    code: `use Payum\\Core\\PayumBuilder;
use Payum\\Core\\Model\\Payment;

$payum = (new PayumBuilder())
    ->addDefaultStorages()
    ->addGateway('offline', ['factory' => 'offline'])
    ->getPayum();

$storage = $payum->getStorage(Payment::class);
$payment = $storage->create();
$payment->setNumber(uniqid());
$payment->setTotalAmount(9900);
$payment->setCurrencyCode('USD');
$payment->setDescription('Pro plan, annual');
$storage->update($payment);

$token = $payum->getTokenFactory()
    ->createCaptureToken('offline', $payment, 'done.php');

header('Location: ' . $token->getTargetUrl());`
  }
}

/** Verified against the library's `docs/get-it-started.md`; the calls are
 *  identical on the released 1.7.x line and on 2.x. Until this existed the site
 *  proved only configuration — every sample was a builder or a YAML file, and
 *  nothing showed a request object actually executing, which left the "full
 *  lifecycle, not just the charge" claim asserted rather than demonstrated. */
export const DONE_SNIPPET = `// done.php — wherever the customer lands after paying.
$gateway = $payum->getGateway($token->getGatewayName());

$gateway->execute($status = new GetHumanStatus($token));

$status->getValue(); // STATUS_CAPTURED`

export const FACTS: Fact[] = [
  { label: 'installs', value: RELEASE.installs, href: PACKAGIST_URL },
  { label: 'stars', value: RELEASE.stars, href: GITHUB_URL },
  { label: 'release', value: `v${RELEASE.version}`, href: RELEASES_URL },
  { label: 'released', value: RELEASE.released, href: RELEASES_URL },
  { label: 'php', value: RELEASE.php, href: PACKAGIST_URL },
  { label: 'licence', value: RELEASE.licence, href: `${GITHUB_URL}/blob/master/LICENSE` }
]

export const FEATURE_GROUPS: FeatureGroup[] = [
  {
    heading: 'What you write against',
    features: [
      {
        title: 'One unified interface',
        body: 'Capture, Authorize, Refund, Cancel, Payout, Sync and GetHumanStatus are seven request classes, and $gateway->execute() takes all of them — for every gateway you plug in.'
      },
      {
        title: 'Security tokens',
        body: 'Payment details never travel in your URLs. Payum issues single-purpose tokens that carry the gateway, the model and the after-url.'
      },
      {
        title: 'Storage agnostic',
        body: 'Doctrine ORM, MongoDB, filesystem or your own implementation. Payum only asks for a storage interface, not a schema.'
      }
    ]
  },
  {
    heading: 'What it never locks you into',
    features: [
      {
        title: 'Actions & extensions',
        body: 'Every step is a small action you can replace, and every request passes through extensions — logging, retries, currency conversion, fraud checks.'
      },
      {
        title: 'Recurring & payouts',
        body: 'Subscriptions, agreements and outgoing payouts are modelled first-class, not bolted on top of a one-off charge.'
      },
      {
        title: 'Framework agnostic core',
        body: 'Plain PHP at the bottom, thin bridges above. Move from Symfony to Laravel and your payment code travels with you.'
      }
    ]
  }
]

export const PIPELINE: PipelineStep[] = [
  { step: '01', text: 'Build a payment model and persist it in your storage' },
  { step: '02', text: 'Create a capture token pointing at your done-url' },
  { step: '03', text: 'Redirect the customer — Payum speaks the gateway’s dialect' },
  { step: '04', text: 'Gateway notifications land on the notify token' },
  { step: '05', text: 'Ask GetHumanStatus once; act on a single known state' }
]

/** Alphabetical so a visitor scanning for their processor finds it fast,
 *  and so the filter's results stay in a predictable order. */
export const GATEWAYS: string[] = [
  '2Checkout',
  'Adyen',
  'Alipay',
  'Authorize.Net',
  'Be2Bill',
  'BitPay',
  'Braintree',
  'Coinbase',
  'Custom gateway',
  'GoPay',
  'Iyzico',
  'Klarna Checkout',
  'Klarna Invoice',
  'Mollie',
  'Multisafepay',
  'Nets',
  'Offline / cash',
  'Payex',
  'Paymill',
  'Payone',
  'PayPal Express',
  'PayPal Pro',
  'PayPlug',
  'Paysafecard',
  'PayU',
  'PayZen',
  'PostFinance',
  'Przelewy24',
  'Redsys',
  'Robokassa',
  'Sage Pay',
  'SEPA Direct Debit',
  'Skrill',
  'Sofort',
  'Stripe',
  'Vindicia',
  'WeChat Pay',
  'Wirecard',
  'Worldpay',
  'Xendit'
]

export const STATUSES: PaymentStatus[] = [
  { code: 'STATUS_NEW', text: 'Created, not yet sent to a gateway', tone: 'new' },
  { code: 'STATUS_PENDING', text: 'Awaiting the customer or the processor', tone: 'pending' },
  { code: 'STATUS_AUTHORIZED', text: 'Funds reserved, capture when you ship', tone: 'pending' },
  { code: 'STATUS_CAPTURED', text: 'Money taken successfully', tone: 'settled' },
  { code: 'STATUS_REFUNDED', text: 'Returned in full or in part', tone: 'settled' },
  { code: 'STATUS_FAILED', text: 'Declined by the processor', tone: 'ended' },
  { code: 'STATUS_CANCELED', text: 'Abandoned or voided before capture', tone: 'ended' }
]
