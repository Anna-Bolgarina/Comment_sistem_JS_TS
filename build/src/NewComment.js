"use strict";
class NewComment {
    constructor() {
        this.commentNewText = document.querySelector(".comment-new__text");
        this.userMaxText = document.querySelector(".user__maxtext");
        this.sendButton = document.querySelector(".comment-new__button");
        this.maxQuantityText = 1000;
        this.commentSize = () => {
            if (this.commentNewText !== null) {
                this.commentNewText.style.height = "60px";
                this.commentNewText.scrollHeight + "px";
            }
        };
        this.checkQuantityText = () => {
            const userQuantityText = document.querySelector(".user__text-counter");
            if (this.commentNewText !== null &&
                this.sendButton !== null &&
                this.userMaxText !== null &&
                userQuantityText !== null) {
                const commentNewContent = this.commentNewText.value;
                if (+commentNewContent.length === 0) {
                    this.sendButton.classList.add("button-notActiv");
                    userQuantityText.innerHTML = `Макс. ${this.maxQuantityText} символов`;
                }
                else if (+commentNewContent.length > 0) {
                    this.sendButton.classList.remove("button-notActiv");
                    userQuantityText.innerHTML = `${+commentNewContent.length}/${this.maxQuantityText}`;
                }
                if (+commentNewContent.length >= this.maxQuantityText) {
                    this.userMaxText.style.display = "inline-block";
                    this.sendButton.classList.add("button-notActiv");
                }
            }
        };
        this.listenerNewComment();
    }
    listenerNewComment() {
        if (this.commentNewText && this.sendButton) {
            this.commentNewText.setAttribute("style", "height:" + this.commentNewText.scrollHeight + "px;overflow-y:hidden;");
            this.commentNewText.addEventListener("input", this.commentSize, false);
            this.commentNewText.addEventListener("keyup", this.checkQuantityText, false);
        }
    }
    getNewComment() {
        const commentNewContent = document.querySelector(".comment-new__text");
        const text = commentNewContent !== null ? commentNewContent.value : "";
        return text;
    }
    changeButton(text) {
        if (this.sendButton)
            this.sendButton.innerHTML = text;
    }
    clearNewComment() {
        const userQuantityText = document.querySelector(".user__text-counter");
        if (this.commentNewText)
            this.commentNewText.value = "";
        if (userQuantityText)
            userQuantityText.innerHTML = `Макс. ${this.maxQuantityText} символов`;
        if (this.sendButton)
            this.sendButton.classList.add("button-notActiv");
    }
    focusCommentNewText() {
        if (this.commentNewText)
            this.commentNewText.focus();
    }
    changeCommentNewText(textCommentNewText) {
        if (this.commentNewText)
            this.commentNewText.placeholder = textCommentNewText;
    }
}
