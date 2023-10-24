const commentSystem = new CommentSystem();

const randomUsers: { name: string; avatar: string }[] = [
  { name: "Максим Авдеенко", avatar: "img/Max.png" },
  { name: "Джунбокс", avatar: "img/Djun.png" },
  { name: "Алексей", avatar: "img/Alex.png" },
  { name: "Анна", avatar: "img/Anna.png" },
  { name: "Георг", avatar: "img/Georg.png" },
  { name: "Ира", avatar: "img/Ira.png" },
  { name: "Смит", avatar: "img/Smit.png" },
];

let randomUser:any;
function updateRandomUser(){
  randomUser = randomUsers[Math.floor(Math.random() * randomUsers.length)];
  return randomUser;
};
updateRandomUser();
commentSystem.getUser(randomUser.name, randomUser.avatar);
