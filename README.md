# Bento Ordering App

This app consists of a bento order form and a simple order management backend.
Form items have different restrictions:

- Only one choice can be selected for the main course and sauce
- A minimum of one choice for the starch and nuts. $10 per item beyond the first choice.
- A minimum of seven choices can be selected for the vegetables and fruits. $15 per item beyond the first seven choices. If the random checkbox is checked, other choices are disabled.
- Only all items pass validation enables the "add bento" button
- Orders will appear in the dashboard synchronously

[Demo](https://bento-ordering-app.vercel.app) / [Dashboard](https://bento-ordering-app.vercel.app/login)

email: a@a.com // pass: 123456

---

#### TODO:

- Refactor form items. The current code is too long and not flexible. Similar items can be re-written into reusable functions.
- Add order filtering: today's, past, and future, incompleted orders, etc.

#### SCREENSHOTS:

![](https://raw.githubusercontent.com/williamafil/bento-ordering-app/main/public/screenshot-1.png)

![](https://raw.githubusercontent.com/williamafil/bento-ordering-app/main/public/screenshot-2.png)
