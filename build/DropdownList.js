"use strict";
class DropdownList extends CommentSystem {
    constructor(commentParam) {
        super();
        this.listenerItem = (event) => {
            if (this.filterSelected !== null) {
                this.filterSelected.innerHTML = (event.target).innerHTML;
                switch ((event.target).innerHTML) {
                    case "По количеству ответов":
                        this.replyNumberFilter();
                        break;
                    case "По количеству оценок":
                        this.ratingFilter();
                        break;
                    case "По дате":
                        this.dateFilter();
                        break;
                }
            }
            if (this.filterItems !== null)
                this.filterItems.forEach((item) => {
                    const checkMark = item.querySelector(".check-mark");
                    if (checkMark !== null)
                        checkMark.style.display = "none";
                });
            if (this.filterList !== null)
                this.filterList.style.display = "none";
        };
        this.comments = commentParam;
        this.commentFilter = document.querySelector(".comment__filter");
        this.commentSortingText =
            this.commentFilter !== null
                ? this.commentFilter.querySelector(".comment__sorting")
                : null;
        this.filterSelected =
            this.commentSortingText !== null
                ? this.commentSortingText.querySelector(".comment-sorting__text")
                : null;
        this.filterList =
            this.commentSortingText !== null
                ? this.commentSortingText.querySelector(".dropdown__list")
                : null;
        this.filterItems =
            this.commentSortingText !== null
                ? this.commentSortingText.querySelectorAll(".dropdown__item")
                : null;
        this.commentFavorit =
            this.commentFilter !== null
                ? this.commentFilter.querySelector(".comment__favorit")
                : null;
        this.dropdown();
        this.favoritesCommentFilter();
        this.listenerFilterDirection();
    }
    currentFilter() {
        if (this.filterSelected) {
            switch (this.filterSelected.innerHTML) {
                case "По дате":
                    this.dateFilter();
                    break;
                case "По количеству оценок":
                    this.ratingFilter();
                    break;
                case "По количеству ответов":
                    this.replyNumberFilter();
                    break;
            }
        }
    }
    listenerFilterDirection() {
        const filterDirectionArrow = this.commentSortingText !== null
            ? this.commentSortingText.querySelector(".dropdoun__arrow")
            : null;
        if (filterDirectionArrow)
            filterDirectionArrow.addEventListener("click", () => {
                if (filterDirectionArrow.style.rotate === "0deg") {
                    filterDirectionArrow.style.rotate = "180deg";
                }
                else {
                    filterDirectionArrow.style.rotate = "0deg";
                }
                this.currentFilter();
            });
    }
    filterDirection() {
        const filterDirectionArrow = this.commentSortingText !== null
            ? this.commentSortingText.querySelector(".dropdoun__arrow")
            : null;
        if (filterDirectionArrow) {
            if (filterDirectionArrow.style.rotate === "0deg") {
                return -1;
            }
            else {
                return 1;
            }
        }
    }
    favoritesCommentFilter() {
        const listener = (event) => {
            (event.target).classList.toggle("comment__favorite_active");
            if ((event.target).classList.contains("comment__favorite_active")) {
                super.newCommentHidden(true);
                this.comments.hiddenComments(true);
                this.comments.favorites.renderFavoriteComments();
            }
            else {
                super.newCommentHidden(false);
                this.comments.hiddenComments(false);
                this.comments.favorites.cleanFavoriteComments();
            }
        };
        if (this.commentFavorit)
            this.commentFavorit.addEventListener("click", listener);
    }
    dropdown() {
        if (this.commentSortingText) {
            if (this.filterSelected !== null)
                this.filterSelected.addEventListener("click", () => {
                    if (this.filterList !== null) {
                        if (this.filterList.style.display === "block") {
                            this.filterList.style.display = "none";
                        }
                        else {
                            this.filterList.style.display = "block";
                        }
                    }
                    if (this.filterItems !== null)
                        this.filterItems.forEach((item) => this.chooseItem(item));
                });
        }
    }
    chooseItem(item) {
        const span = item.querySelector("span");
        const checkMark = item.querySelector(".check-mark");
        if (span &&
            this.filterSelected &&
            span.innerHTML === this.filterSelected.innerHTML) {
            if (checkMark !== null)
                checkMark.style.display = "block";
        }
        item.removeEventListener("click", this.listenerItem);
        item.addEventListener("click", this.listenerItem);
    }
    dateFilter() {
        const data = super.getDATA();
        const array = data.history;
        const direction = this.filterDirection();
        const newArr = array.sort((commentBlock_1, commentBlock_2) => {
            const a = new Date(commentBlock_1.comment.commentTime.fullDate).getTime();
            const b = new Date(commentBlock_2.comment.commentTime.fullDate).getTime();
            if (direction !== 0)
                return a - b;
            if (direction < 0)
                return b - a;
        });
        data.history = newArr;
        localStorage.setItem("DATA", JSON.stringify(data));
        this.comments.updateComments();
    }
    replyNumberFilter() {
        const data = super.getDATA();
        const array = data.history;
        const direction = this.filterDirection();
        const newArr = array.sort((commentBlock_1, commentBlock_2) => {
            const a = Object.keys(commentBlock_1.replyes).length;
            const b = Object.keys(commentBlock_2.replyes).length;
            if (direction !== 0)
                return a - b;
            if (direction < 0)
                return b - a;
        });
        data.history = newArr;
        localStorage.setItem("DATA", JSON.stringify(data));
        this.comments.updateComments();
    }
    ratingFilter() {
        const data = super.getDATA();
        const array = data.history;
        const direction = this.filterDirection();
        const newArr = array.sort((commentBlock_1, commentBlock_2) => {
            const a = commentBlock_1.rating;
            const b = commentBlock_2.rating;
            if (direction !== 0)
                return a - b;
            if (direction < 0)
                return b - a;
        });
        data.history = newArr;
        localStorage.setItem("DATA", JSON.stringify(data));
        this.comments.updateComments();
    }
}
