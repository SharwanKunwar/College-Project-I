# Focus Planner

## Fourth Semester Project

### Project Title

**Focus Planner – A Task Management and Productivity System**

---

## Project Overview

Focus Planner is a web-based task management application developed as a **Fourth Semester Project**. The system helps users organize their daily tasks by allowing them to create, manage, and track tasks based on priority and progress. It aims to improve productivity, time management, and task organization through a simple and intuitive interface.

Each user has a personal account where they can securely log in and manage only their own tasks.

---

## Objectives

* Develop a secure task management application.
* Allow users to create, update, and delete tasks.
* Organize tasks according to priority levels.
* Track task progress from Pending to Completed.
* Improve users' productivity and daily planning.

---

## Key Features

* User Registration and Login
* Secure Authentication using Spring Security
* Create, Edit, Delete, and View Tasks
* Priority Management (High, Medium, Low)
* Task Status Tracking (Pending, In Progress, Completed)
* Organize tasks for Today or Tomorrow
* Task Notes
* Automatic timestamps for task creation, start, and completion
* User-specific task management

---

## Technologies Used

### Backend

* Java
* Spring Boot
* Spring Security
* Spring Data JPA
* Hibernate
* PostgreSQL

### Frontend

* HTML
* CSS
* JS

### Tools

* IntelliJ IDEA
* Vs Code
* Docker
* PostgreSQL
* Postman
* Git & GitHub

---

## Database Design

### User Table

* User ID
* Username
* Password

### Task Table

* Task ID
* User ID (Foreign Key)
* Title
* Description
* Priority
* Status
* Task For (Today/Tomorrow)
* Created At
* Started At
* Finished At
* Note

Relationship:

One User → Many Tasks

---

## Workflow

1. User registers an account.
2. User logs into the system.
3. User creates a new task.
4. User selects priority and schedule.
5. User starts working on the task.
6. Task status changes from **Pending** → **In Progress** → **Completed**.
7. User can add completion notes.
8. All tasks are stored securely in PostgreSQL.

---

## Project Architecture

```
client/FocusPlanner
       │
    REST API
       │
Spring Boot Backend
       │
Spring Security
       │
Spring Data JPA (Hibernate)
       │
PostgreSQL Database
```

---

## Expected Outcome

The Focus Planner system provides an efficient platform for managing daily activities. Users can securely organize tasks, monitor progress, prioritize important work, and maintain productivity through a clean and user-friendly interface.

---

## Future Enhancements

* Email Verification
* Password Reset
* JWT Authentication
* Due Date Calendar
* Task Categories
* Search and Filter
* Notifications and Reminders
* Dashboard Analytics
* Dark Mode

---

## Conclusion

Focus Planner demonstrates the practical implementation of modern web application development using Java Spring Boot, html, css, js, and PostgreSQL. The project integrates authentication, database management, REST APIs, and responsive user interfaces to provide an effective task management solution. It also strengthens understanding of full-stack development, software architecture, and database design, making it an ideal academic project for the fourth semester. isn't it?
