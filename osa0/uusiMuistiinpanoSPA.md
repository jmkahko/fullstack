sequenceDiagram
    participant selain
    participant palvelin
    
    selain->>palvelin: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate palvelin
    palvelin-->>selain: Selain lähettää JSON muotoisen lisäyksen payloadissa headerissa
    deactivate palvelin