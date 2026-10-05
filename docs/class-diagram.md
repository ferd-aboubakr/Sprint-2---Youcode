# Class diagram

Global domain model of the LMS. Phase 1 implements `Course`, `Module`, `Resource` (and the bonus `Category`); the other classes are designed now so that Phases 2 and 3 extend the model without breaking it.

```mermaid
classDiagram
    direction LR

    class User {
        +ObjectId _id
        +String firstName
        +String lastName
        +String email
        +String passwordHash
        +Role role
        +Boolean isActive
        +Date createdAt
        +Date updatedAt
    }

    class Role {
        <<enumeration>>
        LEARNER
        TRAINER
        ADMIN
    }

    class Category {
        +ObjectId _id
        +String name
        +String slug
        +String description
    }

    class Course {
        +ObjectId _id
        +String title
        +String slug
        +String description
        +Level level
        +String[] tags
        +Number durationHours
        +CourseStatus status
        +Date publishedAt
        +Date createdAt
        +Date updatedAt
        +publish()
        +archive()
    }

    class Level {
        <<enumeration>>
        BEGINNER
        INTERMEDIATE
        ADVANCED
    }

    class CourseStatus {
        <<enumeration>>
        DRAFT
        PUBLISHED
        ARCHIVED
    }

    class Module {
        +ObjectId _id
        +String title
        +String description
        +Number order
    }

    class Resource {
        +ObjectId _id
        +String title
        +ResourceType type
        +String url
        +Number durationMinutes
        +Number order
    }

    class ResourceType {
        <<enumeration>>
        VIDEO
        ARTICLE
        PDF
        LINK
    }

    class Enrollment {
        +ObjectId _id
        +EnrollmentStatus status
        +Date enrolledAt
        +Date completedAt
        +progressPercentage() Number
    }

    class EnrollmentStatus {
        <<enumeration>>
        ACTIVE
        COMPLETED
        CANCELLED
    }

    class Progress {
        +ObjectId _id
        +Boolean completed
        +Date completedAt
    }

    class Quiz {
        +ObjectId _id
        +String title
        +Question[] questions
        +Number passingScore
    }

    class Question {
        +String label
        +String[] choices
        +Number correctChoiceIndex
        +Number points
    }

    class QuizAttempt {
        +ObjectId _id
        +Number[] answers
        +Number score
        +Boolean passed
        +Date submittedAt
        +computeScore() Number
    }

    class Feedback {
        +ObjectId _id
        +Number rating
        +String comment
        +Date createdAt
    }

    User "1" --> "0..*" Course : teaches (trainer)
    Category "1" --> "0..*" Course : classifies
    Course "1" *-- "1..*" Module : contains
    Module "1" *-- "0..*" Resource : contains
    Module "1" *-- "0..1" Quiz : evaluates
    Quiz "1" *-- "1..*" Question : contains

    User "1" --> "0..*" Enrollment : enrolls (learner)
    Course "1" --> "0..*" Enrollment : has
    Enrollment "1" *-- "0..*" Progress : tracks
    Progress "0..*" --> "1" Resource : concerns

    User "1" --> "0..*" QuizAttempt : submits (learner)
    Quiz "1" --> "0..*" QuizAttempt : receives

    User "1" --> "0..*" Feedback : writes (learner)
    Course "1" --> "0..*" Feedback : receives

    User ..> Role
    Course ..> Level
    Course ..> CourseStatus
    Resource ..> ResourceType
    Enrollment ..> EnrollmentStatus
```

## Notes

- **Composition** (`*--`): a `Module` cannot exist without its `Course`, a `Resource` or a `Quiz` without its `Module`; deleting the parent deletes the children.
- **Association** (`-->`): `Enrollment`, `QuizAttempt` and `Feedback` reference a `User` with role `learner`; `Course.trainer` references a `User` with role `trainer`.
- Uniqueness constraints: `User.email`, `Category.name`, `Course.slug`, (`Module.course`, `Module.order`), (`Enrollment.learner`, `Enrollment.course`), (`Feedback.learner`, `Feedback.course`).
- In MongoDB, the child side stores the reference (`Module.course`, `Resource.module`, ...), which keeps documents small and lets each collection be queried independently.
