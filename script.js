// ------------------------
// 1. CONFIGURATION
// ------------------------

// 1a. Bible books and chapter counts
const bibleBooks = {
  "Genesis":50,"Exodus":40,"Leviticus":27,"Numbers":36,"Deuteronomy":34,
  "Joshua":24,"Judges":21,"Ruth":4,"1 Samuel":31,"2 Samuel":24,"1 Kings":22,"2 Kings":25,
  "1 Chronicles":29,"2 Chronicles":36,"Ezra":10,"Nehemiah":13,"Esther":10,"Job":42,
  "Psalms":150,"Proverbs":31,"Ecclesiastes":12,"Song of Solomon":8,"Isaiah":66,
  "Jeremiah":52,"Lamentations":5,"Ezekiel":48,"Daniel":12,"Hosea":14,"Joel":3,
  "Amos":9,"Obadiah":1,"Jonah":4,"Micah":7,"Nahum":3,"Habakkuk":3,
  "Zephaniah":3,"Haggai":2,"Zechariah":14,"Malachi":4,
  "Matthew":28,"Mark":16,"Luke":24,"John":21,"Acts":28,"Romans":16,"1 Corinthians":16,
  "2 Corinthians":13,"Galatians":6,"Ephesians":6,"Philippians":4,"Colossians":4,
  "1 Thessalonians":5,"2 Thessalonians":3,"1 Timothy":6,"2 Timothy":4,"Titus":3,
  "Philemon":1,"Hebrews":13,"James":5,"1 Peter":5,"2 Peter":3,"1 John":5,"2 John":1,
  "3 John":1,"Jude":1,"Revelation":22
};

// 1b. Chapter videos (all chapters pre-listed with default video)
const defaultVideo = "https://www.youtube.com/embed/GQI72THyO5I";
const chapterVideos = {};
Object.keys(bibleBooks).forEach(book => {
  for(let i=1;i<=bibleBooks[book];i++){
    chapterVideos[book+"_"+i] = defaultVideo;
  }
});

// 1c. Google Sheet CSV link (replace with your published CSV
//  link)
const sheetURL ="https://docs.google.com/spreadsheets/d/e/2PACX-1vTZrQs6zU6I5mFjdeYntSSfTZKd3G6Qz6pyP2iUD1K-Oat5SyZkK0vLtueHPDvsbKmk8Snl4x_TX3wB/pubhtml?widget=true&amp;headers=false"

// Global quizzes object
let chapterQuizzes = {};

// ------------------------
// 2. FETCH QUIZZES FROM GOOGLE SHEET
// ------------------------

// ------------------------
// 3. ELEMENTS
// ------------------------
const booksContainer = document.getElementById("books");
const chaptersContainer = document.getElementById("chapters");
const bookTitle = document.getElementById("bookTitle");

// ------------------------
// 4. CREATE BOOK BUTTONS
// ------------------------
Object.keys(bibleBooks).forEach(book => {
  const button = document.createElement("button");
  button.innerText = book;
  button.onclick = () => {
    bookTitle.innerText = book + " Chapters";
    showChapters(book);
  };
  booksContainer.appendChild(button);
});

// ------------------------
// 5. SHOW CHAPTERS
// ------------------------
function showChapters(book){
  chaptersContainer.innerHTML = "";
  const totalChapters = bibleBooks[book];
  
  for(let i=1;i<=totalChapters;i++){
    const key = book+"_"+i;
    const btn = document.createElement("button");
    btn.innerText = localStorage.getItem(key)==="read" ? "Chapter "+i+" ✔" : "Chapter "+i;
    btn.onclick = ()=> openChapter(book,i);
    chaptersContainer.appendChild(btn);
  }
}

// ------------------------
// 6. OPEN CHAPTER
// ------------------------
function openChapter(book,chapter){
  saveProgress(book,chapter);
  document.getElementById("bookTitle").innerText = book;
  document.getElementById("chapterTitle").innerText = book + " Chapter " + chapter;

  // Fetch Bible verses
  fetch("https://bible-api.com/"+book+" "+chapter)
    .then(resp=>resp.json())
    .then(data=>{
      let verses = "";
      data.verses.forEach(v=>{
        verses += v.verse+". "+v.text+"<br><br>";
      });
      document.getElementById("bibleText").innerHTML = verses;
    })
    .catch(err=>{
      document.getElementById("bibleText").innerHTML = "Bible verses not available.";
    });

  // Load video
  const videoKey = book+"_"+chapter;
  const videoURL = chapterVideos[videoKey] || defaultVideo;
  document.getElementById("videoSection").innerHTML =
    `<iframe width="100%" height="315" src="${videoURL}" allowfullscreen></iframe>`;

  // Load quiz
  const quiz = chapterQuizzes[videoKey] || {question:"Default quiz", options:["Option 1","Option 2","Option 3"], answer:"Option 1"};
  loadQuiz(quiz);
}

// ------------------------
// 7. LOAD QUIZ
// ------------------------
function loadQuiz(quiz){
  document.getElementById("quizQuestion").innerText = quiz.question;
  let html = "";
  quiz.options.forEach(opt=>{
    html += `<button onclick="checkAnswer('${opt}','${quiz.answer}')">${opt}</button><br><br>`;
  });
  document.getElementById("quizOptions").innerHTML = html;
  document.getElementById("quizResult").innerText = "";
  // Display your name in quizzes
document.getElementById("ownerName").innerText = "Created by Gabriel Mubanga | BibleConnect";
}

// ------------------------
// 8. CHECK ANSWER
// ------------------------
function checkAnswer(selected,correct){
  document.getElementById("quizResult").innerText = selected===correct ? "✅ Correct" : "❌ Wrong";
}

// ------------------------
// 9. SAVE PROGRESS
// ------------------------
function saveProgress(book,chapter){
  localStorage.setItem(book+"_"+chapter,"read");
}

// ------------------------
// 10. SEARCH BOOKS
// ------------------------
function searchBooks(){
  const input = document.getElementById("searchBooks").value.toLowerCase();
  const buttons = booksContainer.getElementsByTagName("button");
  for(let i=0;i<buttons.length;i++){
    buttons[i].style.display = buttons[i].innerText.toLowerCase().includes(input) ? "" : "none";
  }
}