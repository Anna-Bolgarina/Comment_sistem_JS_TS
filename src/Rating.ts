class Rating extends CommentSystem {
 public addListenerCommentsRatingButtons(commentNamb: number): void {
    const commentBlockEl: HTMLElement | null = document.querySelector(
      `[data-commentnamb="${commentNamb}"]`
    );
    if (commentBlockEl) {
      const ratingButtonBlock: HTMLElement | null =
        commentBlockEl.querySelector(".comments__rating");
      if (ratingButtonBlock)
        this.listenerButtonBlock(ratingButtonBlock, commentNamb);
    }
  }
 public addListenerReplyRatingButtons(
    commentNamb: number,
    replyNamb: number
  ): void {
    const commentBlockEl: HTMLElement | null = document.querySelector(
      `[data-commentnamb="${commentNamb}"]`
    );
    if (commentBlockEl) {
      const replyEl: HTMLElement | null = commentBlockEl.querySelector(
        `[data-replynamb="${replyNamb}"]`
      );
      if (replyEl) {
        const ratingButtonBlock: HTMLElement | null =
          replyEl.querySelector(".comments__rating");
        if (ratingButtonBlock)
          this.listenerButtonBlock(
            ratingButtonBlock,
            commentNamb,
            replyNamb
          );
      }
    }
  }
 private listenerButtonBlock(
    ratingBlock: HTMLElement|null,
    commentNamb: number,
    replyNamb?: number
  ): void {
    const currentData: any = super.getDATA();
    if (ratingBlock) {
      const plusButton: HTMLElement | null = ratingBlock.querySelector(".plus");
      const minusButton: HTMLElement | null = ratingBlock.querySelector(
        ".minus"
      );
      const counter: HTMLElement | null = ratingBlock.querySelector(
        ".likeCounter"
      );
      if (counter) {
        let curCounter: number = 0;
        if (replyNamb === undefined) {
          currentData.history.forEach((commentBlock: any) => {
            if (+commentBlock.commentNamb === commentNamb) {
              curCounter =
                commentBlock.rating === undefined ? 0 : +commentBlock.rating;
            }
            counter.innerHTML = String(curCounter);
            this.changeStyleCounter(counter, curCounter);
          });
        } else {
          currentData.history.forEach((commentBlock: any) => {
            if (+commentBlock.commentNamb === commentNamb) {
              curCounter =
                commentBlock.replyes[`reply_${replyNamb}`].rating === undefined
                  ? 0
                  : +commentBlock.replyes[`reply_${replyNamb}`].rating;
            }
            counter.innerHTML = String(curCounter);
            this.changeStyleCounter(counter, curCounter);
          });
        }
        let newCounter: number = curCounter;
        const plusListener = (): void => {
          if (plusButton && minusButton) {
            if (!plusButton.classList.contains("plus_disable")) {
              newCounter++;
              if (newCounter !== curCounter) {
                plusButton.classList.add("plus_disable");
              }
              minusButton.classList.remove("minus_disable");
              counter.innerHTML = String(newCounter);
              this.updateCounterHistory(newCounter, commentNamb, replyNamb);
              this.changeStyleCounter(counter, newCounter);
            }
          }
        };
        const minusListener = (): void => {
          if (plusButton && minusButton) {
            if (!minusButton.classList.contains("minus_disable")) {
              newCounter--;
              if (newCounter !== curCounter) {
                minusButton.classList.add("minus_disable");
              }
              plusButton.classList.remove("plus_disable");
              counter.innerHTML = String(newCounter);
              this.updateCounterHistory(newCounter, commentNamb, replyNamb);
              this.changeStyleCounter(counter, newCounter);
            }
          }
        };
        if (plusButton) plusButton.addEventListener("click", plusListener);
        if (minusButton) minusButton.addEventListener("click", minusListener);
      }
    }
  }
 private updateCounterHistory(
    curCounter: number,
    commentNamb: number,
    replyNamb?: number
  ): void {
    const currentData: any = super.getDATA();
    if (replyNamb === undefined) {
      let newCommentBlock: any;
      currentData.history.forEach((commentBlock: any) => {
        if (+commentBlock.commentNamb === commentNamb) {
          commentBlock.rating = curCounter;
          newCommentBlock = commentBlock;
        }
      });
      currentData.history.forEach((commentBlock: any, index: number) => {
        if (+commentBlock.commentNamb === commentNamb) {
          currentData.history[index] = newCommentBlock;
        }
      });
      localStorage.setItem("DATA", JSON.stringify(currentData));
    } else {
      currentData.history.forEach((commentBlock: any) => {
        if (+commentBlock.commentNamb === commentNamb) {
          commentBlock.replyes[`reply_${replyNamb}`].rating = curCounter;
          super.updateHistoryReply(
            commentNamb,
            replyNamb,
            commentBlock.replyes[`reply_${replyNamb}`]
          );
        }
      });
    }
  }
 private changeStyleCounter(
    counterElement: HTMLElement,
    counterNumber: number
  ): void {
    if (counterNumber > 0) {
      counterElement.style.color = "#8AC540";
    } else if (counterNumber < 0) {
      counterElement.style.color = "#FF0000";
      counterElement.innerHTML = String(+counterElement.innerHTML * -1);
    } else {
      counterElement.style.color = "rgba(0, 0, 0, 0.4";
    }
  }
}