# Shared Entities

These are foundational abstractions closing the gap between low-level implementation details and business entities specific to the application domain.

## Rules

- Can use external dependencies.
- Must NOT depend on anything above the common layer in the project abstraction hierarchy.
- Must NOT depend on each other.
