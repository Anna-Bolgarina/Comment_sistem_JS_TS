"use strict";
class AnswerComment extends CommentSystem {
    constructor(userNewComment, rating, favorites) {
        super();
        this.userNewComment = userNewComment;
        this.rating = rating;
        this.favorites = favorites;
        this.commentNamb = 0;
        this.preUserName = "";
        this.replyNamb = 0;
    }
    addListenerReplyButton(commentNamb) {
        const commentBlock = document.querySelector(`[data-commentnamb="${commentNamb}"]`);
        if (commentBlock) {
            const replyButton = commentBlock.querySelector(".comment-flow__buttonAnswer");
            const buttonListenerReply = (event) => {
                var _b;
                console.log("buttonListenerReply", event.target, replyButton);
                let _a;
                if (event.target === replyButton) {
                    console.log("true");
                    this.commentNamb = commentNamb;
                    this.userNewComment.changeButton("Ответить");
                    this.userNewComment.changeCommentNewText("Введите ваш ответ пользователю");
                    this.userNewComment.focusCommentNewText();
                    if (this.userNewComment.sendButton)
                        this.userNewComment.sendButton.dataset.mode = "reply";
                    if (commentBlock.dataset.commentnamb)
                        this.commentNamb = +commentBlock.dataset.commentnamb;
                    this.preUserName = (_b = (_a =
                        commentBlock.querySelector(".user-flow__name"))) === null || _b === void 0 ? void 0 : _b.innerHTML;
                    super.getDATA().history.forEach((commentBlock) => {
                        if (+commentBlock.commentNamb === commentNamb) {
                            this.replyNamb = Object.keys(commentBlock.replyes).length;
                        }
                    });
                }
                else {
                    this.userNewComment.changeButton("Отправить");
                    this.userNewComment.changeCommentNewText("Введите текст сообщения...");
                    if (this.userNewComment.sendButton)
                        this.userNewComment.sendButton.dataset.mode = "comment";
                }
            };
            if (commentBlock)
                commentBlock.addEventListener("click", buttonListenerReply);
        }
    }
    createReplyes(replyText) {
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
        const replyHTMLTemplate = this.getTemplateReply(this.replyNamb, userName, preUserName, userAvatar, replyTxt, currentDate.displayDate);
        this.renderReply(commentNamb, replyHTMLTemplate);
        if (commentNamb !== undefined) {
            this.rating.addListenerReplyRatingButtons(commentNamb, this.replyNamb);
            this.favorites.addListenerReplyFavoritesButtons(commentNamb, this.replyNamb);
        }
    }
    getTemplateReply(replyNamb, userName, preUserName, userAvatar, replyTxt, date) {
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
    updateReply(commentBlock) {
        let htmlTemplateReply;
        let replyBlock;
        for (replyBlock in commentBlock.replyes) {
            htmlTemplateReply = this.getTemplateReply(commentBlock.replyes[replyBlock].replyNamb, commentBlock.replyes[replyBlock].userName, commentBlock.replyes[replyBlock].preUserName, commentBlock.replyes[replyBlock].userAvatar, commentBlock.replyes[replyBlock].replyText, commentBlock.replyes[replyBlock].date.displayDate);
            this.renderReply(commentBlock.commentNamb, htmlTemplateReply);
            this.rating.addListenerReplyRatingButtons(commentBlock.commentNamb, commentBlock.replyes[replyBlock].replyNamb);
            this.favorites.addListenerReplyFavoritesButtons(commentBlock.commentNamb, commentBlock.replyes[replyBlock].replyNamb);
        }
    }
    renderReply(commentNamb, html) {
        const commentBlock = document.querySelector(`[data-commentnamb="${commentNamb}"]`);
        if (commentBlock)
            commentBlock.insertAdjacentHTML("beforeend", html);
    }
}
