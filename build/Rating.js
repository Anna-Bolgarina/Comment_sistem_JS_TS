"use strict";
class Rating extends CommentSystem {
    addListenerCommentsRatingButtons(commentNamb) {
        const commentBlockEl = document.querySelector(`[data-commentnamb="${commentNamb}"]`);
        if (commentBlockEl) {
            const ratingButtonBlock = commentBlockEl.querySelector(".comments__rating");
            if (ratingButtonBlock)
                this.listenerButtonBlock(ratingButtonBlock, commentNamb);
        }
    }
    addListenerReplyRatingButtons(commentNamb, replyNamb) {
        const commentBlockEl = document.querySelector(`[data-commentnamb="${commentNamb}"]`);
        if (commentBlockEl) {
            const replyEl = commentBlockEl.querySelector(`[data-replynamb="${replyNamb}"]`);
            if (replyEl) {
                const ratingButtonBlock = replyEl.querySelector(".comments__rating");
                if (ratingButtonBlock)
                    this.listenerButtonBlock(ratingButtonBlock, commentNamb, replyNamb);
            }
        }
    }
    listenerButtonBlock(ratingBlock, commentNamb, replyNamb) {
        const currentData = super.getDATA();
        if (ratingBlock) {
            const plusButton = ratingBlock.querySelector(".plus");
            const minusButton = ratingBlock.querySelector(".minus");
            const counter = ratingBlock.querySelector(".likeCounter");
            if (counter) {
                let curCounter = 0;
                if (replyNamb === undefined) {
                    currentData.history.forEach((commentBlock) => {
                        if (+commentBlock.commentNamb === commentNamb) {
                            curCounter =
                                commentBlock.rating === undefined ? 0 : +commentBlock.rating;
                        }
                        counter.innerHTML = String(curCounter);
                        this.changeStyleCounter(counter, curCounter);
                    });
                }
                else {
                    currentData.history.forEach((commentBlock) => {
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
                let newCounter = curCounter;
                const plusListener = () => {
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
                const minusListener = () => {
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
                if (plusButton)
                    plusButton.addEventListener("click", plusListener);
                if (minusButton)
                    minusButton.addEventListener("click", minusListener);
            }
        }
    }
    updateCounterHistory(curCounter, commentNamb, replyNamb) {
        const currentData = super.getDATA();
        if (replyNamb === undefined) {
            let newCommentBlock;
            currentData.history.forEach((commentBlock) => {
                if (+commentBlock.commentNamb === commentNamb) {
                    commentBlock.rating = curCounter;
                    newCommentBlock = commentBlock;
                }
            });
            currentData.history.forEach((commentBlock, index) => {
                if (+commentBlock.commentNamb === commentNamb) {
                    currentData.history[index] = newCommentBlock;
                }
            });
            localStorage.setItem("DATA", JSON.stringify(currentData));
        }
        else {
            currentData.history.forEach((commentBlock) => {
                if (+commentBlock.commentNamb === commentNamb) {
                    commentBlock.replyes[`reply_${replyNamb}`].rating = curCounter;
                    super.updateHistoryReply(commentNamb, replyNamb, commentBlock.replyes[`reply_${replyNamb}`]);
                }
            });
        }
    }
    changeStyleCounter(counterElement, counterNumber) {
        if (counterNumber > 0) {
            counterElement.style.color = "#8AC540";
        }
        else if (counterNumber < 0) {
            counterElement.style.color = "#FF0000";
            counterElement.innerHTML = String(+counterElement.innerHTML * -1);
        }
        else {
            counterElement.style.color = "rgba(0, 0, 0, 0.4";
        }
    }
}
