"use strict";
class Favorite extends CommentSystem {
    constructor() {
        super();
        this.favoriteRandomKey = Math.floor(Math.random() * 10000);
    }
    renderFavoriteComments() {
        const currentData = super.getDATA();
        for (let favoriteComment in currentData.user.favorites) {
            const ava = currentData.user.favorites[favoriteComment].commentAvatar;
            const nickName = currentData.user.favorites[favoriteComment].commentName;
            const text = currentData.user.favorites[favoriteComment].commentText;
            const time = currentData.user.favorites[favoriteComment].commentTime.displayDate;
            const htmlTemplate = this.getTemplateFavoriteComment(nickName, ava, text, time);
            const comments = document.querySelector(".comment__flow");
            if (comments)
                comments.insertAdjacentHTML("afterbegin", htmlTemplate);
        }
    }
    cleanFavoriteComments() {
        const comments = document.querySelector(".comment__flow");
        const favoriteBlocks = document.querySelectorAll('.comment-flow__blok[data-favorite="favorite"]');
        if (comments)
            favoriteBlocks.forEach((item) => comments.removeChild(item));
    }
    addListenerCommentsFavoritesButtons(commentNamb) {
        const commentBlockEl = document.querySelector(`[data-commentnamb="${commentNamb}"]`);
        if (commentBlockEl) {
            const favoritesButton = commentBlockEl.querySelector(".comment-flow__buttonFavorite");
            if (favoritesButton)
                this.listenerFavoritesButton(favoritesButton, commentNamb);
        }
    }
    addListenerReplyFavoritesButtons(commentNamb, replyNamb) {
        const commentBlockEl = document.querySelector(`[data-commentNamb="${commentNamb}"]`);
        if (commentBlockEl) {
            const replyEl = commentBlockEl.querySelector(`[data-replyNamb="${replyNamb}"]`);
            if (replyEl) {
                const favoritesButton = replyEl.querySelector(".comment-flow__buttonFavorite");
                if (favoritesButton)
                    this.listenerFavoritesButton(favoritesButton, commentNamb, replyNamb);
            }
        }
    }
    listenerFavoritesButton(favoritesButton, commentNamb, replyNamb) {
        this.updateFavoriteButtons(favoritesButton, commentNamb, replyNamb);
        const favoritesButtonListenerForRemoveFromFavorite = () => {
            if (favoritesButton) {
                favoritesButton.innerHTML = this.getEmptyHeartIcon();
                favoritesButton.dataset.favorite = "false";
            }
            const currentData = super.getDATA();
            if (replyNamb === undefined) {
                for (let favoriteComment in currentData.user.favorites) {
                    if (+currentData.user.favorites[favoriteComment].srcCommentNamb ===
                        commentNamb &&
                        currentData.user.favorites[favoriteComment].srcReplyNamb ===
                            "undefined") {
                        delete currentData.user.favorites[favoriteComment];
                    }
                }
            }
            else {
                for (let favoriteComment in currentData.user.favorites) {
                    if (currentData.user.favorites[favoriteComment].srcReplyNamb !==
                        "undefined" &&
                        +currentData.user.favorites[favoriteComment].srcCommentNamb ===
                            commentNamb) {
                        delete currentData.user.favorites[favoriteComment];
                    }
                }
            }
            if (favoritesButton && favoritesButton.dataset.favorite === "true") {
                favoritesButton.removeEventListener("click", favoritesButtonListenerForAddedToFavorite);
                favoritesButton.addEventListener("click", favoritesButtonListenerForRemoveFromFavorite);
            }
            else if (favoritesButton &&
                favoritesButton.dataset.favorite === "false") {
                favoritesButton.removeEventListener("click", favoritesButtonListenerForRemoveFromFavorite);
                favoritesButton.addEventListener("click", favoritesButtonListenerForAddedToFavorite);
            }
            localStorage.setItem("DATA", JSON.stringify(currentData));
        };
        const favoritesButtonListenerForAddedToFavorite = () => {
            if (favoritesButton) {
                favoritesButton.innerHTML = this.getFullHeartIcon();
                favoritesButton.dataset.favorite = "true";
            }
            const currentData = super.getDATA();
            if (replyNamb === undefined) {
                currentData.history.forEach((commentBlock) => {
                    if (+commentBlock.commentNamb === commentNamb) {
                        currentData.user.favorites[`favoriteComment_${this.favoriteRandomKey}`] = commentBlock.comment;
                    }
                });
                currentData.user.favorites[`favoriteComment_${this.favoriteRandomKey}`].srcCommentNamb = `${commentNamb}`;
                currentData.user.favorites[`favoriteComment_${this.favoriteRandomKey}`].srcReplyNamb = `${replyNamb}`;
            }
            else {
                currentData.history.forEach((commentBlock) => {
                    if (+commentBlock.commentNamb === commentNamb) {
                        currentData.user.favorites[`favoriteComment_${this.favoriteRandomKey}`] = {
                            commentAvatar: commentBlock.replyes[`reply_${replyNamb}`].userAvatar,
                            commentName: commentBlock.replyes[`reply_${replyNamb}`].userName,
                            commentText: commentBlock.replyes[`reply_${replyNamb}`].replyText,
                            commentTime: commentBlock.replyes[`reply_${replyNamb}`].date,
                        };
                    }
                });
                currentData.user.favorites[`favoriteComment_${this.favoriteRandomKey}`].srcCommentNamb = `${commentNamb}`;
                currentData.user.favorites[`favoriteComment_${this.favoriteRandomKey}`].srcReplyNamb = `${replyNamb}`;
            }
            localStorage.setItem("DATA", JSON.stringify(currentData));
            if (favoritesButton && favoritesButton.dataset.favorite === "true") {
                favoritesButton.removeEventListener("click", favoritesButtonListenerForAddedToFavorite);
                favoritesButton.addEventListener("click", favoritesButtonListenerForRemoveFromFavorite);
            }
            else if (favoritesButton &&
                favoritesButton.dataset.favorite === "false") {
                favoritesButton.removeEventListener("click", favoritesButtonListenerForRemoveFromFavorite);
                favoritesButton.addEventListener("click", favoritesButtonListenerForAddedToFavorite);
            }
            this.favoriteRandomKey++;
        };
        if (favoritesButton && favoritesButton.dataset.favorite === "true") {
            favoritesButton.removeEventListener("click", favoritesButtonListenerForAddedToFavorite);
            favoritesButton.addEventListener("click", favoritesButtonListenerForRemoveFromFavorite);
        }
        else if (favoritesButton &&
            favoritesButton.dataset.favorite === "false") {
            favoritesButton.removeEventListener("click", favoritesButtonListenerForRemoveFromFavorite);
            favoritesButton.addEventListener("click", favoritesButtonListenerForAddedToFavorite);
        }
    }
    updateFavoriteButtons(favoritesButton, commentNamb, replyNamb) {
        const currentData = super.getDATA();
        if (replyNamb === undefined) {
            for (let favoriteComment in currentData.user.favorites) {
                if (+currentData.user.favorites[favoriteComment].srcCommentNamb ===
                    commentNamb &&
                    currentData.user.favorites[favoriteComment].srcReplyNamb ===
                        "undefined") {
                    if (favoritesButton) {
                        favoritesButton.innerHTML = this.getFullHeartIcon();
                        favoritesButton.dataset.favorite = "true";
                    }
                }
            }
        }
        else {
            for (let favoriteComment in currentData.user.favorites) {
                if (currentData.user.favorites[favoriteComment].srcReplyNamb !==
                    "undefined" &&
                    +currentData.user.favorites[favoriteComment].srcCommentNamb ===
                        commentNamb) {
                    if (favoritesButton) {
                        favoritesButton.innerHTML = this.getFullHeartIcon();
                        favoritesButton.dataset.favorite = "true";
                    }
                }
            }
        }
    }
    getFullHeartIcon() {
        return `<img src="img/Heart2.svg" alt="в избранном" />В избранном`;
    }
    getEmptyHeartIcon() {
        return `<img src="img/Heart1.svg" alt="в избранном" />В избранное`;
    }
    getTemplateFavoriteComment(userName, userAvatar, commentsTxt, date) {
        return `
      <div class="comment-flow__blok" data-favorite="favorite">
          <div class="comment-flow__comment">
                  <img class="user__avatar" src="${userAvatar}" alt="аватарка">
              <div class="comment-flow__contant">
                  <div class="comment-flow__user">
                      <span class="user__name">${userName}</span>
                      <time class="comment-flow__time">${date}</time>
                  </div>
                  <p class="comment-flow__text">
                      ${commentsTxt}
                  </p>
              </div>
          </div>
      </div>
      `;
    }
}
