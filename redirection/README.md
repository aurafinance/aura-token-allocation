Use `redirection.schema.json` to create a redirection JSON file.

This should look like:

```json
{
  "0x(Source address)": "0x(Destination address)",
}
```

Or with shares (for redirecting to multiple recipients):

```json
{
    "0x(Source address)": {
        "0x(Destination address 1)": "0.5",
        "0x(Destination address 2)": "0.5"
    }
}
```

Or with both:

```json
{
    "0x(Source address 1)": "0x(Destination address 3)",
    "0x(Source address 2)": {
        "0x(Destination address 1)": "0.5",
        "0x(Destination address 2)": "0.5"
    }
}
```

You can also forward in multiple steps (i.e. redirect to address A, then redirect address A to a map of addresses).

This can be validated with tools like [jsonschemavalidator.net](https://www.jsonschemavalidator.net) or in your editor/IDE.
