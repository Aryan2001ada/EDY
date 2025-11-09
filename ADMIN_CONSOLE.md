# Admin Console Documentation

## Overview

The ExamPrep Admin Console is a comprehensive content management system for sole administrators to manage all platform content. Built with Next.js 14, it features full CRUD operations, rich text editing, and analytics.

## Features Implemented

### 1. Universities & Courses Management

**Universities (`/admin/universities`)**
- ✅ Create new universities
- ✅ Edit university details
- ✅ Set/update exam deadlines
- ✅ Delete universities (cascades to courses)
- ✅ View course count per university
- ✅ Modal-based forms for quick editing

**Courses (`/admin/courses`)**
- ✅ Create courses linked to universities
- ✅ Add course codes and summaries
- ✅ Expandable view showing skills
- ✅ Add/remove skills per course
- ✅ View question and review counts
- ✅ Delete courses (cascades to skills/questions)

**Skills**
- ✅ Add skills/topics to courses
- ✅ View question page count per skill
- ✅ Delete skills (cascades to questions)

### 2. Question Bank Editor

**Features (`/admin/questions`)**
- ✅ Rich text editor (ReactQuill)
- ✅ LaTeX support: Use `$$formula$$` syntax
- ✅ Code blocks for programming questions
- ✅ Text formatting: Bold, italic, lists, headers
- ✅ 4 questions per page (matches schema)
- ✅ Multiple choice with radio button selection
- ✅ Optional explanations for answers
- ✅ Course and skill selection dropdowns
- ✅ Edit existing question pages
- ✅ Delete question pages
- ✅ Auto-updates course question count

**Question Structure:**
```typescript
{
  id: string
  question: string (HTML with LaTeX)
  options: string[4]
  correctAnswer: number (0-3)
  explanation?: string
}
```

### 3. Exam Deadline Calendar

**Features (`/admin/calendar`)**
- ✅ Full calendar view (react-big-calendar)
- ✅ Color-coded deadlines:
  - Gray: Past deadlines
  - Red: Within 7 days (urgent)
  - Orange: Within 30 days (soon)
  - Blue: 30+ days away
- ✅ Click events to edit dates
- ✅ Month and agenda views
- ✅ Visual legend for date categories

### 4. Review Curation Dashboard

**Features (`/admin/reviews`)**
- ✅ View all student reviews
- ✅ Filter by: All, Featured, Not Featured
- ✅ Toggle featured status (highlights on course pages)
- ✅ Delete inappropriate reviews
- ✅ View review details:
  - Star rating
  - Course and university
  - Student name
  - Submission date
- ✅ Featured reviews highlighted with golden border

### 5. Basic Analytics

**Features (`/admin/analytics`)**
- ✅ Key metrics display:
  - Total universities
  - Total courses
  - Total questions
  - Total users
  - Active subscriptions
  - Monthly revenue estimate
- ✅ User growth line chart (6 months)
- ✅ User tier distribution (pie chart)
- ✅ Top 10 courses by question count
- ✅ Real-time data from database

## Technical Architecture

### Server Actions (src/actions/)

All operations use Next.js Server Actions for type-safe, secure database operations:

**universities.ts**
- `getUniversities()` - Fetch all with course counts
- `getUniversity(id)` - Single university with courses
- `createUniversity(formData)` - Create new
- `updateUniversity(id, formData)` - Update existing
- `deleteUniversity(id)` - Delete (cascades)

**courses.ts**
- `getCourses(universityId?)` - All courses, optionally filtered
- `getCourse(id)` - Single course with skills
- `createCourse(formData)` - Create new
- `updateCourse(id, formData)` - Update existing
- `deleteCourse(id)` - Delete (cascades)
- `getSkills(courseId)` - Skills for a course
- `createSkill(formData)` - Add skill to course
- `updateSkill(id, formData)` - Update skill
- `deleteSkill(id)` - Delete skill

**questions.ts**
- `getQuestionPages(skillId?)` - All pages, optionally filtered
- `getQuestionPage(id)` - Single page with relations
- `createQuestionPage(data)` - Create 4-question page
- `updateQuestionPage(id, data)` - Update questions
- `deleteQuestionPage(id)` - Delete page
- Auto-updates course `totalQuestions` count

**reviews.ts**
- `getReviews(courseId?)` - All reviews with user/course data
- `toggleFeaturedReview(id, status)` - Feature/unfeature
- `deleteReview(id)` - Remove review

**analytics.ts**
- `getAnalytics()` - Platform-wide statistics
- `getGrowthData()` - User growth over time
- `getCourseStats()` - Top courses metrics

### Database Integration

All actions use Prisma ORM with the following models:
- University (1:many with Courses)
- Course (many:1 with University, 1:many with Skills)
- Skill (many:1 with Course, 1:many with QuestionPages)
- QuestionPage (many:1 with Skill, stores JSON array)
- Review (many:1 with User and Course)
- User (NextAuth managed)

### Validation

Uses Zod schemas for:
- Form validation
- Type safety
- Error messages
- Required field enforcement

### Revalidation

All mutations call `revalidatePath()` to update:
- Admin pages
- Public-facing student pages
- Related entity pages

## UI Components

### AdminNav (src/components/admin/AdminNav.tsx)
- Fixed sidebar navigation
- Active route highlighting
- Quick access to all sections
- "Back to Site" link

### QuestionEditor (src/components/admin/QuestionEditor.tsx)
- Reusable question editing component
- ReactQuill integration
- LaTeX toolbar
- Validation before save
- Supports create and edit modes

### Data Tables
- Sortable columns
- Action buttons (Edit, Delete)
- Expandable rows (courses)
- Color-coded badges
- Loading states
- Empty states

## Usage Guide

### Adding Content Flow

1. **Create University**
   - Go to Universities
   - Click "Add University"
   - Enter name and deadline
   - Save

2. **Add Courses**
   - Go to Courses
   - Click "Add Course"
   - Select university
   - Enter course code and summary
   - Save

3. **Add Skills**
   - In Courses, click "Add Skill" on a course
   - Enter skill name
   - Save

4. **Create Questions**
   - Go to Questions
   - Click "Add Question Page"
   - Select course and skill
   - Write 4 questions with LaTeX/formatting
   - Set correct answers
   - Add explanations
   - Save

5. **Manage Deadlines**
   - Go to Calendar
   - Click on a university's deadline
   - Update date
   - Save

6. **Curate Reviews**
   - Go to Reviews
   - Review student feedback
   - Feature excellent reviews
   - Delete spam/inappropriate content

7. **Monitor Performance**
   - Go to Analytics
   - View platform growth
   - Track top courses
   - Monitor subscriptions

## LaTeX Examples

In questions, you can use LaTeX for math formulas:

```
What is the derivative of $$x^2$$?

A) $$2x$$
B) $$x$$
C) $$2$$
D) $$x^2$$

Explanation: Using the power rule, $$\frac{d}{dx}x^n = nx^{n-1}$$
```

## Code Block Examples

For programming questions, use the code block button:

```
What does this code output?
```python
for i in range(5):
    print(i * 2)
```

## Dependencies

```json
{
  "react-hook-form": "Form handling",
  "zod": "Validation",
  "react-quill": "Rich text editor",
  "katex": "LaTeX rendering",
  "react-big-calendar": "Calendar view",
  "date-fns": "Date utilities",
  "recharts": "Charts and graphs"
}
```

## Security

- Protected routes via NextAuth middleware
- Server-side validation with Zod
- CSRF protection via Next.js
- SQL injection prevention via Prisma
- TODO: Add admin role checking

## Performance

- Server-side rendering where possible
- Client-side state for modals
- Optimistic UI updates
- Efficient database queries with Prisma
- Revalidation only for affected paths

## Future Enhancements

- [ ] Bulk question import (CSV/JSON)
- [ ] Image upload for questions
- [ ] Question tagging system
- [ ] Advanced search and filters
- [ ] Export functionality
- [ ] Version history for questions
- [ ] Admin user roles (multi-admin support)
- [ ] Activity audit log
- [ ] Email notifications for reviews
- [ ] Question preview mode

## Troubleshooting

**LaTeX not rendering:**
- Ensure you use `$$` delimiters
- Check browser console for errors

**Calendar not loading:**
- Verify exam deadlines are valid dates
- Check database connection

**Questions not saving:**
- Ensure all 4 options are filled
- Verify a correct answer is selected
- Check skill is selected

## Support

For issues or questions about the admin console, refer to:
- Next.js 14 App Router docs
- Prisma documentation
- ReactQuill API docs
- react-big-calendar docs
