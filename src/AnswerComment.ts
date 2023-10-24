class AnswerComment extends CommentSystem {
  private rating: Rating;
  private favorites: Favorite;
  private commentNamb: number;
  private preUserName: string | undefined;
  private replyNamb: number;

  constructor(userNewComment: NewComment, rating: Rating, favorites: Favorite) {
    super();
    this.userNewComment = userNewComment;
    this.rating = rating;
    this.favorites = favorites;
    this.commentNamb = 0;
    this.preUserName = "";
    this.replyNamb = 0;
  }

  public addListenerReplyButton(commentNamb: number): void {
    const commentBlock: HTMLElement | null = document.querySelector(
      `[data-commentnamb="${commentNamb}"]`
    );
    if (commentBlock) {
      const replyButton = commentBlock.querySelector(
        ".comment-flow__buttonAnswer"
      );
      const buttonListenerReply = (event: Event) => {
        console.log("buttonListenerReply", event.target, replyButton);
        let _a;
        if (event.target === replyButton) {
          console.log("true");
          this.commentNamb = commentNamb;
          this.userNewComment.changeButton("Ответить");
          this.userNewComment.changeCommentNewText(
            "Введите ваш ответ пользователю"
          );
          this.userNewComment.focusCommentNewText();
          if (this.userNewComment.sendButton)
            this.userNewComment.sendButton.dataset.mode = "reply";
          if (commentBlock.dataset.commentnamb)
            this.commentNamb = +commentBlock.dataset.commentnamb;
          this.preUserName = (_a =
            commentBlock.querySelector(".user-flow__name"))?.innerHTML;
          super.getDATA().history.forEach((commentBlock: any) => {
            if (+commentBlock.commentNamb === commentNamb) {
              this.replyNamb = Object.keys(commentBlock.replyes).length;
            }
          });
        } else {
          this.userNewComment.changeButton("Отправить");
          this.userNewComment.changeCommentNewText(
            "Введите текст сообщения..."
          );
          if (this.userNewComment.sendButton)
            this.userNewComment.sendButton.dataset.mode = "comment";
        }
      };
      if (commentBlock)
        commentBlock.addEventListener("click", buttonListenerReply);
    }
  }

  public createReplyes(replyText: string): void {
    const commentNamb = this.commentNamb;
    const userName = super.getUserName();
    const preUserName = this.preUserName;
    const userAvatar = super.getUserAvatar();
    const currentDate = super.getCurrentDate();
    const replyTxt = replyText;
    const newReply = {
      commentNamb: this.commentNamb,
      replyNamb: this.replyNamb,
      userName: userName,
      preUserName: preUserName,
      userAvatar: userAvatar,
      date: currentDate,
      replyText: replyTxt,
    };
    super.updateHistoryReply(commentNamb, this.replyNamb, newReply);
    const replyHTMLTemplate = this.getTemplateReply(
      this.replyNamb,
      userName,
      preUserName,
      userAvatar,
      replyTxt,
      currentDate.displayDate
    );
    this.renderReply(commentNamb, replyHTMLTemplate);
    if (commentNamb !== undefined) {
      this.rating.addListenerReplyRatingButtons(commentNamb, this.replyNamb);
      this.favorites.addListenerReplyFavoritesButtons(
        commentNamb,
        this.replyNamb
      );
    }
  }

  private getTemplateReply(
    replyNamb: number,
    userName: string | undefined,
    preUserName: string | undefined,
    userAvatar: string | null | undefined,
    replyTxt: string,
    date: string
  ) {
    return `
    <div class="commentBlock__reply" data-replynamb=${replyNamb}>
      <img  class="user__avatar" src="${userAvatar}" alt="автарка">
    <div class="comments__info">
      <div class="comment-flow__user">
        <h3 class="user-flow__name">${userName}</h3>
        <h3 class="comments__preUserName">
        <img src="img/Answer.svg" alt="ответить">
          ${preUserName}
        </h3>
        <time class="comment-flow__time">${date}</time>
      </div>
      <p class="comment-flow__text">
        ${replyTxt}
      </p>
      <div class="comments__buttons">
        <button class="comment-flow__buttonFavorite" data-favorite="false">
          <img src="img/Heart1.svg" alt="в избранное">
            В избранное
        </button>
        <div class="comments__rating">
          <button class="minus"><img src="img/minus.svg" alt="минус"></button>
          <span class="likeCounter">0</span>
          <button class="plus"><img src="img/Plus.svg" alt="плюс"></button>
        </div>
      </div>
    </div>
  </div>`;
  }

  updateReply(commentBlock: any): void {
    let htmlTemplateReply: string;
    let replyBlock: string;
    for (replyBlock in commentBlock.replyes) {
      htmlTemplateReply = this.getTemplateReply(
        commentBlock.replyes[replyBlock].replyNamb,
        commentBlock.replyes[replyBlock].userName,
        commentBlock.replyes[replyBlock].preUserName,
        commentBlock.replyes[replyBlock].userAvatar,
        commentBlock.replyes[replyBlock].replyText,
        commentBlock.replyes[replyBlock].date.displayDate
      );
      this.renderReply(commentBlock.commentNamb, htmlTemplateReply);
      this.rating.addListenerReplyRatingButtons(
        commentBlock.commentNamb,
        commentBlock.replyes[replyBlock].replyNamb
      );
      this.favorites.addListenerReplyFavoritesButtons(
        commentBlock.commentNamb,
        commentBlock.replyes[replyBlock].replyNamb
      );
    }
  }

  renderReply(commentNamb: number | undefined, html: string): void {
    const commentBlock: HTMLElement | null = document.querySelector(
      `[data-commentnamb="${commentNamb}"]`
    );
    if (commentBlock) commentBlock.insertAdjacentHTML("beforeend", html);
  }
}
