class CommentSystem {
  private DATA: string | null;
  protected userNewComment: NewComment;
  private numberComments: number;

  constructor() {
    if (!localStorage.getItem("DATA")) {
      this.DATA = '{"user": {}, "history": []}';
      localStorage.setItem("DATA", this.DATA);
    } else {
      this.DATA = localStorage.getItem("DATA")!;
    }
    this.userNewComment = new NewComment();
    this.numberComments = 0;
  }

  public getUser(nickName: string, ava: string) {
    
    const userAvatar: HTMLElement | null =
      document.querySelector(".user__avatar");
    if (userAvatar !== null) userAvatar.setAttribute("src", ava);
    const userName: HTMLElement | null = document.querySelector(".user__name");
    if (userName !== null) userName.innerHTML = nickName;
    const data = this.getDATA();
    data.user = {
      userName: nickName,
      userAvatar: ava,
      favorites:
        data.user.favorites === undefined ||
        Object.keys(data.user.favorites).length === 0
          ? {}
          : data.user.favorites,
    };
    localStorage.setItem("DATA", JSON.stringify(data));

    const comment = new CommentFlow(this.userNewComment);
  }

  protected getUserName() {
    const userNameElement: HTMLElement | null =
      document.querySelector(".user__name");
    if (userNameElement) {
      const userName = userNameElement.innerHTML;
      return userName;
    }
  }

  protected getUserAvatar() {
    const userAvatarElement: HTMLElement | null =
      document.querySelector(".user__avatar");
    if (userAvatarElement !== null) {
      const userAvatar = userAvatarElement.getAttribute("src");
      return userAvatar;
    }
  }

  protected newCommentHidden(bool: boolean) {
    const newComment: HTMLElement | null =
      document.querySelector(".comment__new");
    if (bool) {
      if (newComment) newComment.style.display = "none";
    } else {
      if (newComment) newComment.style.display = "flex";
    }
  }

  protected getDATA(): any {
    const currentData: string | null = localStorage.getItem("DATA");
    if (currentData) {
      const parseData = JSON.parse(currentData);
      if (Object.keys(parseData).includes("history")) {
        return parseData;
      }
    }
  }

  protected getCurrentDate(): any {
    const date = new Date();
    const fullDate = new Date(
      Date.UTC(
        date.getUTCFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds()
      )
    );
    const displayDate = `${date.getDate()}.${date.getMonth()}  ${date.getHours()}:${date.getMinutes()}`;
    return {
      fullDate: fullDate,
      displayDate: displayDate,
    };
  }

  protected addHistoryComments(commentBlock: object): void {
    const currentData = this.getDATA();
    currentData.history.push(commentBlock);
    localStorage.setItem("DATA", JSON.stringify(currentData));
  }

  protected updateHistoryReply(
    commentNamb: number|undefined,
    replyNamb: number,
    replyBlock: object
  ) {
    const currentData = this.getDATA();
    currentData.history.forEach((commentBlock: any) => {
      if (+commentBlock.commentNamb === commentNamb) {
        commentBlock.replyes[`reply_${replyNamb}`] = replyBlock;
      }
    });
    localStorage.setItem("DATA", JSON.stringify(currentData));
  }

  protected updateNumberComments() {
    const numberCommentsElement = document.querySelector(
      ".comment-all__count"
    ) as HTMLElement;
    this.numberComments = this.getNumberComments();
    if (numberCommentsElement)
      numberCommentsElement.innerHTML = `(${this.numberComments})`;
  }

  protected getNumberComments(): number {
    return Object.keys(this.getDATA().history).length;
  }
}
