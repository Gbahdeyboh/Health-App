![HealthApp Image](https://res.cloudinary.com/gbahdeyboh/image/upload/v1588299034/healthAPP_vylst4.png)

# Health-App
HealthApp is a system built to bridge the communication gap between the students and the health centre at the Federal University of Agriculture, Abeokuta. 

The goal behind this system is to create a means for students to get quick response especially in times of emergencies, reducing the fatality rate in the process.

This repository holds the Front end code for the project that has three parts to it:
1. Client-side web for the health centre
2. Mobile app for the students
3. Alarm (IoT) system for the health centre
4. Server-side web application
 

Submission should be graded based on the **master** branch. However, we are committed to improving the project beyond what we have at submission for the Solutions challenge. Hence, new code will be pushed to the **staging**.
 
## Setup
This project currently uses firebase, ensure you have `firebase cli` installed.
 - Clone this reposotory
 - Navigate the the directory of this project on your terminal and run the command `firebase serve`
 
## Design
Just so you understand why every decision on the front end was made, our designer put in a lot of tremendous effort into  drafting a well detailed design case study of the application. The design and case study are below/
- [Design](https://www.figma.com/file/OwmgzH1B0SRBUacRnvXxwG/Solution-Challenge-2020?node-id=0%3A1)
- [Design Case study](https://medium.com/@kazeem.oluwatosin/health-app-a-ux-case-study-baa0ef93c72b)

## Testing 
The Web App has been hosted on firebase and can be accessed via the URL [https://curefb-web.web.app/](https://curefb-web.web.app/).

Once the app is open, it is required that you login to the app before you're able to use it. We've Created a single account on the back end to be used to Login to the Account. The Account credentials are as follows.

```
Username - ciad4877
Password - Chukwuma
```

## Todos
The app is not complete yet, there are features we left out or that don't quite work as expected, we're enthusiastic about it and want to keep building on our `staging branch`. We want to keep you up to date with our recent updates which is why we're adding a list of todos that we plan on implementing after submission (We submitted `master branch` and would be pushing updates to `staging branch`).

1) Maintain the state of a chat
2) Make chatting with multiple students have a different state and be seamless
3) Add a Video calling feature(What we have on the app is just the Interface, it does not work)
