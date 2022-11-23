--Readme document for Tim Chen, timyc2@uci.edu, 94835140--

1. How many assignment points do you believe you completed (replace the *'s with your numbers)?

19/20
- 2/2 The ability to log overnight sleep
- 2/2 The ability to log sleepiness during the day
- 2/2 The ability to view these two categories of logged data
- 4/4 Either using a native device resource or backing up logged data
- 4/4 Following good principles of mobile design
- 3/4 Creating a compelling app
- 2/2 A readme and demo video which explains how these features were implemented and their design rationale

2. How long, in hours, did it take you to complete this assignment?

    10 hours.

3. What online resources did you consult when completing this assignment? (list specific URLs)
   
    https://ionicframework.com/docs/api/toast
    https://ionicframework.com/docs/api/header
    https://ionicframework.com/docs/api/tabs
    https://ionicframework.com/docs/api/select-option
    https://stackoverflow.com/questions/41146350/how-to-set-default-selected-value-of-ion-option
    https://ionicframework.com/docs/api/select
    https://ionicframework.com/docs/api/infinite-scroll
    https://stackoverflow.com/questions/46339827/ionic-3-ion-textarea-line-break-issue
    https://stackoverflow.com/questions/47173462/get-the-time-difference-between-two-times-in-format-hhmmss

4. What classmates or other individuals did you consult as part of this assignment? What did you discuss?

    No.

5. Is there anything special we need to know in order to run your code?

    No.

--Aim for no more than two sentences for each of the following questions.--


6. Did you design your app with a particular type of user in mind? If so, whom?

    Anyone who understand English and has at least one finger will be able to use this app because it was designed to be "universally" usable (i18n would be out of the scope for this assignment though).

7. Did you design your app specifically for iOS or Android, or both?

    Both initially, iOS after testing because Android's webview renders absolute-positioned elements in an awful way.

8. How can a person log overnight sleep in your app? Why did you choose to support logging overnight sleep in this way?

    On the first tab, the user is presented with a stopwatch-like button to start timing their sleep; the button can be re-activated to cancel the timer and record their sleep from a modal popup. This method makes tracking the sleeping time easier and offers versatility for the user to add additional information about it.

9. How can a person log sleepiness during the day in your app? Why did you choose to support logging sleepiness in this way?

    The second tab allows for the user to choose an option from the Stanford sleepiness scale and optionally add a journal entry with it to clarify what was going on at the time. The implementation was done this way to give users more options to clarify on their log entry while being ignorable for users who don't want to type more.

10. How can a person view the data they logged in your app? Why did you choose to support viewing logged data in this way?

    They can click a card element either on the dedicated logs tab or from the recent logs section of either the overnight sleep tab or sleepiness tab. This implementation was done with the idea of convenience in mind. Some users may want to instantly click their log to share with other people, so not having to switch tabs is pretty nice.

11. Which feature choose--using a native device resource, backing up logged data, or both?

    Both.

12. If you used a native device resource, what feature did you add? How does this feature change the app's experience for a user?

    Sharing the log entry either through social media or contacts. The user can flex how much they slept or un-sleepy they are during the day.

13. If you backed up logged data, where does it back up to?

    LocalStorage (Pinia).

14. How does your app implement or follow principles of good mobile design?

    On the first bootup, the user is presented with a short useful tutorial regarding the app. Users can quickly undo log deletions; irreversible actions have a warning confirmation to prevent mistakes.