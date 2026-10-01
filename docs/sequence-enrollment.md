# Complementary diagram: course enrollment sequence

```mermaid
sequenceDiagram
    autonumber
    actor L as Learner
    participant API as Express API
    participant Auth as Auth middleware
    participant EC as EnrollmentController
    participant DB as MongoDB

    L->>API: POST /api/courses/:id/enrollments (Bearer token)
    API->>Auth: verify token & role
    alt invalid token or role != learner
        Auth-->>L: 401 Unauthorized / 403 Forbidden
    else authenticated learner
        Auth->>EC: req.user
        EC->>DB: Course.findById(id)
        alt course not found or status != published
            DB-->>EC: null / draft course
            EC-->>L: 404 Not Found (JSON error)
        else published course
            EC->>DB: Enrollment.findOne({ learner, course, status: active })
            alt already enrolled
                DB-->>EC: existing enrollment
                EC-->>L: 409 Conflict (JSON error)
            else not enrolled
                EC->>DB: Enrollment.create({ learner, course, status: active })
                DB-->>EC: enrollment
                EC-->>L: 201 Created + enrollment JSON
            end
        end
    end
```

## Why this diagram secures the sprint

Enrollment is the pivot between the public catalog delivered in Phase 1 and the authenticated learning journey of Phases 2 and 3: it is the first flow that combines authentication, role checks, catalog business rules (BR-09, BR-10) and the error contract. Modelling it now validates that the Phase 1 models and the centralized JSON error handling (`404`, `409`, ...) already support the next sprint, and gives the team an unambiguous contract to implement in parallel without rework.
