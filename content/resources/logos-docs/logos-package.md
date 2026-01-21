---
tags:
  - spec
  - logos-core
---
- link: https://github.com/logos-co/logos-package/blob/master/docs/spec.md
- The `index.md` file before gives both the spec and the Project Description, which correctly attempts to differentiate between implementation independent documentation and implementation specific documentation. 


## From the spec page: 

### Overall Description

LGX is a deterministic package format for distributing multi-platform artifacts. It provides a standardized way to bundle platform-specific binaries, libraries, or other files into a single distributable archive with strong guarantees about reproducibility and integrity.

The format is designed to:
- Support multiple platform variants (e.g., `linux-amd64`, `darwin-arm64`) in a single package
- Produce byte-identical archives given identical inputs (deterministic)
- Ensure cross-platform path compatibility through Unicode NFC normalization (macOS often uses decomposed forms; Linux commonly uses composed - NFC avoids "same name, different bytes" breaking lookups, hashing, and determinism)
- Enforce a strict, predictable internal structure
- Provide tooling for creating, modifying, and validating packages

### Definitions & Acronyms

| Term         | Definition                                                                                                                      |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| **LGX**      | Logos Package Format - the package format specified in this document                                                            |
| **Variant**  | A platform-specific or configuration-specific build of the package contents (e.g., `linux-amd64`)                               |
| **NFC**      | Unicode Normalization Form C - a Unicode normalization form that uses canonical decomposition followed by canonical composition |
| **USTAR**    | Unix Standard TAR - a standardized tar archive format                                                                           |
| **Manifest** | The `manifest.json` file containing package metadata                                                                            |
| **Main**     | The entry point file for each variant, specified in the manifest                                                                |
| **COSE**     | CBOR Object Signing and Encryption - reserved for future signature support                                                      |


