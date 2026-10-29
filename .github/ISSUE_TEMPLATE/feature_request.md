name: Feature Request
description: Suggest an idea or feature for FairBill
title: "feat: "
labels: ["enhancement"]
body:
  - type: markdown
    attributes:
      value: Thank you for proposing a new feature for FairBill!
  - type: textarea
    id: problem
    attributes:
      label: Is your feature request related to a problem?
      description: A clear description of what problem or limitation you are encountering.
      placeholder: "I'm frustrated when..."
    validations:
      required: true
  - type: textarea
    id: solution
    attributes:
      label: Proposed Solution
      description: Describe the solution or feature you'd like to see implemented.
    validations:
      required: true
  - type: textarea
    id: alternatives
    attributes:
      label: Alternatives Considered
      description: Any alternative solutions or features you've considered.
    validations:
      required: false
  - type: textarea
    id: context
    attributes:
      label: Additional Context
      description: Add any other context, mockup links, or reference datasets here.
    validations:
      required: false
