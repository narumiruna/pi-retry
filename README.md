# pi-retry

A public [pi](https://pi.dev) extension package that treats provider responses containing `Unknown error (no error details in response)` as retryable.

## Install

```bash
pi install npm:@narumitw/pi-retry
```

Try without installing:

```bash
pi -e npm:@narumitw/pi-retry
```

Try this working tree locally:

```bash
pi -e .
```

## What it does

When an assistant message ends with `stopReason: "error"` and the error message matches `Unknown error (no error details in response)`, the extension appends pi's retryable-provider-error hint so pi's built-in retry path can continue the turn.

## Project layout

```text
extensions/
└── unknown-error-retry/
    ├── index.ts         # pi extension entry point and event wiring
    └── retry-policy.ts  # retry classification and message annotation logic
```

The package manifest points pi at `./extensions/unknown-error-retry`, which follows pi's directory extension convention (`index.ts` as the entry point).
