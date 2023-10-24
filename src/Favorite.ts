class Favorite extends CommentSystem {
  private favoriteRandomKey: number;

  constructor() {
    super();
    this.favoriteRandomKey = Math.floor(Math.random() * 10000);
  }

  public renderFavoriteComments(): void {
    const currentData = super.getDATA();
    for (let favoriteComment in currentData.user.favorites) {
      const ava: string =
        currentData.user.favorites[favoriteComment].commentAvatar;
      const nickName: string =
        currentData.user.favorites[favoriteComment].commentName;
      const text: string =
        currentData.user.favorites[favoriteComment].commentText;
      const time: string =
        currentData.user.favorites[favoriteComment].commentTime.displayDate;
      const htmlTemplate: string = this.getTemplateFavoriteComment(
        nickName,
        ava,
        text,
        time
      );
      const comments: HTMLElement | null =
        document.querySelector(".comment__flow");
      if (comments) comments.insertAdjacentHTML("afterbegin", htmlTemplate);
    }
  }

  public cleanFavoriteComments(): void {
    const comments: HTMLElement | null =
      document.querySelector(".comment__flow");
    const favoriteBlocks: NodeListOf<Element> = document.querySelectorAll(
      '.comment-flow__blok[data-favorite="favorite"]'
    );
    if (comments) favoriteBlocks.forEach((item) => comments.removeChild(item));
  }

  public addListenerCommentsFavoritesButtons(commentNamb: number): void {
    const commentBlockEl: HTMLElement | null = document.querySelector(
      `[data-commentnamb="${commentNamb}"]`
    );
    if (commentBlockEl) {
      const favoritesButton: HTMLElement | null = commentBlockEl.querySelector(
        ".comment-flow__buttonFavorite"
      );
      if (favoritesButton)
        this.listenerFavoritesButton(favoritesButton, commentNamb);
    }
  }

  public addListenerReplyFavoritesButtons(
    commentNamb: number,
    replyNamb: number
  ): void {
    const commentBlockEl: HTMLElement | null = document.querySelector(
      `[data-commentNamb="${commentNamb}"]`
    );
    if (commentBlockEl) {
      const replyEl: HTMLElement | null = commentBlockEl.querySelector(
        `[data-replyNamb="${replyNamb}"]`
      );
      if (replyEl) {
        const favoritesButton: HTMLElement | null = replyEl.querySelector(
          ".comment-flow__buttonFavorite"
        );
        if (favoritesButton)
          this.listenerFavoritesButton(favoritesButton, commentNamb, replyNamb);
      }
    }
  }

  private listenerFavoritesButton(
    favoritesButton: HTMLElement | null,
    commentNamb: number,
    replyNamb?: number
  ): void {
    this.updateFavoriteButtons(favoritesButton, commentNamb, replyNamb);
    const favoritesButtonListenerForRemoveFromFavorite = () => {
      if (favoritesButton) {
        favoritesButton.innerHTML = this.getEmptyHeartIcon();
        favoritesButton.dataset.favorite = "false";
      }
      const currentData = super.getDATA();
      if (replyNamb === undefined) {
        for (let favoriteComment in currentData.user.favorites) {
          if (
            +currentData.user.favorites[favoriteComment].srcCommentNamb ===
              commentNamb &&
            currentData.user.favorites[favoriteComment].srcReplyNamb ===
              "undefined"
          ) {
            delete currentData.user.favorites[favoriteComment];
          }
        }
      } else {
        for (let favoriteComment in currentData.user.favorites) {
          if (
            currentData.user.favorites[favoriteComment].srcReplyNamb !==
              "undefined" &&
            +currentData.user.favorites[favoriteComment].srcCommentNamb ===
              commentNamb
          ) {
            delete currentData.user.favorites[favoriteComment];
          }
        }
      }
      if (favoritesButton && favoritesButton.dataset.favorite === "true") {
        favoritesButton.removeEventListener(
          "click",
          favoritesButtonListenerForAddedToFavorite
        );
        favoritesButton.addEventListener(
          "click",
          favoritesButtonListenerForRemoveFromFavorite
        );
      } else if (
        favoritesButton &&
        favoritesButton.dataset.favorite === "false"
      ) {
        favoritesButton.removeEventListener(
          "click",
          favoritesButtonListenerForRemoveFromFavorite
        );
        favoritesButton.addEventListener(
          "click",
          favoritesButtonListenerForAddedToFavorite
        );
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
        currentData.history.forEach((commentBlock: any) => {
          if (+commentBlock.commentNamb === commentNamb) {
            currentData.user.favorites[
              `favoriteComment_${this.favoriteRandomKey}`
            ] = commentBlock.comment;
          }
        });
        currentData.user.favorites[
          `favoriteComment_${this.favoriteRandomKey}`
        ].srcCommentNamb = `${commentNamb}`;
        currentData.user.favorites[
          `favoriteComment_${this.favoriteRandomKey}`
        ].srcReplyNamb = `${replyNamb}`;
      } else {
        currentData.history.forEach((commentBlock: any) => {
          if (+commentBlock.commentNamb === commentNamb) {
            currentData.user.favorites[
              `favoriteComment_${this.favoriteRandomKey}`
            ] = {
              commentAvatar:
                commentBlock.replyes[`reply_${replyNamb}`].userAvatar,
              commentName: commentBlock.replyes[`reply_${replyNamb}`].userName,
              commentText: commentBlock.replyes[`reply_${replyNamb}`].replyText,
              commentTime: commentBlock.replyes[`reply_${replyNamb}`].date,
            };
          }
        });
        currentData.user.favorites[
          `favoriteComment_${this.favoriteRandomKey}`
        ].srcCommentNamb = `${commentNamb}`;
        currentData.user.favorites[
          `favoriteComment_${this.favoriteRandomKey}`
        ].srcReplyNamb = `${replyNamb}`;
      }
      localStorage.setItem("DATA", JSON.stringify(currentData));
      if (favoritesButton && favoritesButton.dataset.favorite === "true") {
        favoritesButton.removeEventListener(
          "click",
          favoritesButtonListenerForAddedToFavorite
        );
        favoritesButton.addEventListener(
          "click",
          favoritesButtonListenerForRemoveFromFavorite
        );
      } else if (
        favoritesButton &&
        favoritesButton.dataset.favorite === "false"
      ) {
        favoritesButton.removeEventListener(
          "click",
          favoritesButtonListenerForRemoveFromFavorite
        );
        favoritesButton.addEventListener(
          "click",
          favoritesButtonListenerForAddedToFavorite
        );
      }
      this.favoriteRandomKey++;
    };
    if (favoritesButton && favoritesButton.dataset.favorite === "true") {
      favoritesButton.removeEventListener(
        "click",
        favoritesButtonListenerForAddedToFavorite
      );
      favoritesButton.addEventListener(
        "click",
        favoritesButtonListenerForRemoveFromFavorite
      );
    } else if (
      favoritesButton &&
      favoritesButton.dataset.favorite === "false"
    ) {
      favoritesButton.removeEventListener(
        "click",
        favoritesButtonListenerForRemoveFromFavorite
      );
      favoritesButton.addEventListener(
        "click",
        favoritesButtonListenerForAddedToFavorite
      );
    }
  }

  private updateFavoriteButtons(
    favoritesButton: HTMLElement | null,
    commentNamb: number,
    replyNamb?: number
  ): void {
    const currentData = super.getDATA();
    if (replyNamb === undefined) {
      for (let favoriteComment in currentData.user.favorites) {
        if (
          +currentData.user.favorites[favoriteComment].srcCommentNamb ===
            commentNamb &&
          currentData.user.favorites[favoriteComment].srcReplyNamb ===
            "undefined"
        ) {
          if (favoritesButton) {
            favoritesButton.innerHTML = this.getFullHeartIcon();
            favoritesButton.dataset.favorite = "true";
          }
        }
      }
    } else {
      for (let favoriteComment in currentData.user.favorites) {
        if (
          currentData.user.favorites[favoriteComment].srcReplyNamb !==
            "undefined" &&
          +currentData.user.favorites[favoriteComment].srcCommentNamb ===
            commentNamb
        ) {
          if (favoritesButton) {
            favoritesButton.innerHTML = this.getFullHeartIcon();
            favoritesButton.dataset.favorite = "true";
          }
        }
      }
    }
  }

  private getFullHeartIcon(): string {
    return `<img src="img/Heart2.svg" alt="в избранном" />В избранном`;
  }

  private getEmptyHeartIcon(): string {
    return `<img src="img/Heart1.svg" alt="в избранном" />В избранное`;
  }

  private getTemplateFavoriteComment(
    userName: string,
    userAvatar: string,
    commentsTxt: string,
    date: string
  ): string {
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
