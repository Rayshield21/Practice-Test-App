# Practice Test App

## About this app

This app replicates the idea of practice test. It is tied to multiple choice questions, questions with image exhibits, and multiple answer questions. This app is flexible in a way that it gives you the power to create your own questions with sets of choices and answer(s) as long as you follow its directions for use.

## Functionality Summary

Similar to some online exams, you can't go back. You make your choice and you press the button. Score is given after answering all questions. Failure to obtain a perfect score will give you options to restart from the beginning, quit, or doing it again to answer all the questions you answered incorrectly. Rinse and Repeat until you reached the perfect score or you quit.

## Instructions

You don't have to touch the main codebase. All you have to modify is the _sampleData.js_ file. It is very important that you follow the format of writing your questionnaire. An incorrect format will prevent the app from working. One example is that you have a math question with a numerical answer and numeric set of choices and you wrote _**correct: 1**_ instead of _**correct: "1"**_. Missing important non-word characters also leads to program failure so keep that in mind.

## Making your questionnaire

Open the **_sample.js_** file.
Inside you will see the sample data provided. Since it is just a sample, expect hilariously arbitrarily ridiculous questions with a meme exhibit

```javascript
export const testQuestionData = {
  'What is the name of this guy': {
    correct: 'Pacman',
    choices: ['X-Pac', 'Tupac', 'Pacman', 'PuckBoy'],
    imageDIR: '/images/rawr.jpg',
    multipleAnswer: false,
  },
};
```

### This is the skeletal view of a questionnaire code format.

```javascript
export const testQuestionData = {
  // Edit under this block
  "|question|": {
    <correct>: "|answer|",
    choices: [
      "|choice1|",
      "|choice2|",
      "|choice3|"
    ],
    imageDIR: '/images/|filename|.jpg' or |false|,
    multipleAnswer: |true or false|,
  },
};
```

Edit the things encased in bars ex. **|name|**

For **`imageDIR`**, if there is no exhibit to supplement information about the question, write **`false`**. This will tell the program that there is no exhibit for that question. Otherwise, edit the **`|filename|`** in the image directory.

Take note that the file extension in the imageDIR is _.jpg_. Preferably, you better use either the _.jpg_ or _.png_ image. Places your images in the _images_ in the project repository

Do the same thing and write **`false`** for _multipleAnswer_ if the question doesn't ask for more than one answer.

## OH \$#!+ i think i got rid of something

### File Structure

```
Practice-Test-App/
|
| --image
|   |--image.jpg
|
|--app.html
|
|--app.js
|
|--sampleData.js
|
|--style.css
|
|--readme.md
```

If you think something is missing in the structure, it's either get the missing here https://github.com/Rayshield21/Practice-Test-App. If the image folder is missing, just add a folder into the project repository.

If you have very little to no knowledge of programming, I also don't recommend changing the file name of **_sampleData.js_**. Doing so requires you to add more work by having to edit also some part of the html and main javascript code.
