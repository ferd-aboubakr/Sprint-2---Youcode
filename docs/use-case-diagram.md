# Use case diagram

Mermaid has no native UML use case notation, so the diagram uses a flowchart: actors are on the sides, use cases are the rounded nodes inside the system boundary. Role inheritance follows UML generalization: a **Learner** and a **Trainer** can do everything a **Visitor** can, and an **Admin** can do everything a **Trainer** can.

```mermaid
flowchart LR
    Visitor(["👤 Visitor"])
    Learner(["👤 Learner"])
    Trainer(["👤 Trainer"])
    Admin(["👤 Admin"])

    Learner -. generalizes .-> Visitor
    Trainer -. generalizes .-> Visitor
    Admin -. generalizes .-> Trainer

    subgraph LMS["LMS platform"]
        direction TB
        subgraph Catalog["Catalog"]
            UC1(["Browse published courses"])
            UC2(["Filter / search / sort courses"])
            UC3(["View course details & syllabus"])
        end
        subgraph Account["Account"]
            UC4(["Register"])
            UC5(["Log in / log out"])
        end
        subgraph Learning["Learning"]
            UC6(["Enroll in a course"])
            UC7(["Consume resources"])
            UC8(["Track my progress"])
            UC9(["Take a quiz"])
            UC10(["Leave feedback"])
        end
        subgraph Authoring["Course authoring"]
            UC11(["Manage my courses"])
            UC12(["Manage modules & resources"])
            UC13(["Publish / archive a course"])
            UC14(["Create quizzes"])
            UC15(["View learners' progress & feedback"])
        end
        subgraph Administration["Administration"]
            UC16(["Manage users & roles"])
            UC17(["Manage categories"])
            UC18(["Moderate courses & feedback"])
        end
    end

    Visitor --- UC1
    Visitor --- UC2
    Visitor --- UC3
    Visitor --- UC4

    Learner --- UC5
    Learner --- UC6
    Learner --- UC7
    Learner --- UC8
    Learner --- UC9
    Learner --- UC10

    Trainer --- UC5
    Trainer --- UC11
    Trainer --- UC12
    Trainer --- UC13
    Trainer --- UC14
    Trainer --- UC15

    Admin --- UC16
    Admin --- UC17
    Admin --- UC18

    UC2 -. include .-> UC1
    UC7 -. include .-> UC6
    UC9 -. include .-> UC6
    UC10 -. include .-> UC6
    UC6 -. include .-> UC5
    UC11 -. include .-> UC5
```

## Use cases per role

| Role | Use cases | Phase |
| ---- | --------- | ----- |
| Visitor | UC1, UC2, UC3 (catalog), UC4 | 1 (catalog), 2 |
| Learner | UC5, UC6, UC7, UC8, UC9, UC10 | 2-3 |
| Trainer | UC5, UC11, UC12, UC13, UC14, UC15 | 2-3 |
| Admin | UC16, UC17, UC18 (+ all trainer use cases on any course) | 2-3 |
