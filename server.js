<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>TheNotebook</title>

<style>

*{
    margin:0;
    padding:0;
    box-sizing:border-box;
}

body{
    min-height:100vh;
    background:
        radial-gradient(circle at 85% 10%,rgba(100,141,204,.07),transparent 28%),
        #05070c;
    color:#f4f5f7;
    font-family:Georgia,"Times New Roman",serif;
}

header{
    height:82px;
    padding:0 7%;
    display:flex;
    align-items:center;
    justify-content:space-between;
    border-bottom:1px solid #192130;
}

.logo{
    font-size:23px;
}

.logo span{
    color:#91b2e3;
}

.back{
    color:#68758a;
    text-decoration:none;
    font-family:Arial,sans-serif;
    font-size:8px;
    letter-spacing:3px;
    transition:.3s;
}

.back:hover{
    color:#91b2e3;
}

main{
    width:min(820px,86%);
    margin:auto;
    padding:105px 0 80px;
}

.category{
    font-family:Arial,sans-serif;
    font-size:8px;
    letter-spacing:4px;
    color:#91b2e3;
    margin-bottom:22px;
}

h1{
    font-size:clamp(48px,8vw,82px);
    font-weight:400;
    line-height:.95;
    letter-spacing:-4px;
    margin-bottom:25px;
}

.date{
    font-family:Arial,sans-serif;
    font-size:8px;
    letter-spacing:2px;
    color:#58657a;
    margin-bottom:22px;
}

.line{
    width:58px;
    height:1px;
    background:#91b2e3;
    margin-bottom:42px;
}

.content{
    white-space:pre-wrap;
    font-size:18px;
    line-height:2;
    color:#aab4c3;
}


/* =========================
   LIKES
========================= */

.like-wrap{
    margin-bottom:35px;
}

.like-button{
    display:inline-flex;
    align-items:center;
    gap:8px;

    background:transparent;

    border:1px solid #1b2637;

    color:#68758a;

    padding:9px 14px;

    font-family:Arial,sans-serif;

    font-size:9px;

    letter-spacing:1.5px;

    cursor:pointer;

    transition:
        border-color .25s ease,
        color .25s ease,
        background .25s ease;
}

.like-button:hover{
    border-color:#91b2e3;
    color:#91b2e3;
}

.like-icon{
    font-family:Arial,sans-serif;
    font-size:14px;
    line-height:1;
}

.like-button.liked{
    border-color:#91b2e3;
    color:#91b2e3;
    background:rgba(145,178,227,.035);
}

.like-count{
    min-width:8px;
    text-align:center;
}


/* =========================
   REVIEWS
========================= */

.reviews{
    width:min(820px,86%);
    margin:40px auto 120px;
    padding-top:45px;
    border-top:1px solid #192130;
}

.reviews-top{
    display:flex;
    align-items:center;
    justify-content:space-between;
    margin-bottom:38px;
}

.reviews-title{
    font-size:25px;
    font-weight:400;
}

.review-count{
    font-family:Arial,sans-serif;
    font-size:8px;
    letter-spacing:3px;
    color:#58657a;
}


/* WRITE */

.review-write{
    display:grid;
    gap:12px;
    margin-bottom:55px;
}

.review-input,
.review-textarea{
    width:100%;
    background:#070a11;
    color:#f4f5f7;
    border:1px solid #1b2637;
    outline:none;
    padding:15px 16px;
    font-family:Arial,sans-serif;
    font-size:12px;
    transition:.25s;
}

.review-input:focus,
.review-textarea:focus{
    border-color:#91b2e3;
}

.review-input{
    font-family:Georgia,"Times New Roman",serif;
    font-size:16px;
}

.review-textarea{
    min-height:105px;
    resize:vertical;
    line-height:1.7;
}

.review-bottom{
    display:flex;
    align-items:center;
    justify-content:space-between;
}

.review-hint{
    font-family:Arial,sans-serif;
    font-size:8px;
    letter-spacing:1px;
    color:#46536a;
}

.review-button{
    border:0;
    background:#edf1f6;
    color:#05070c;
    padding:12px 19px;
    font-family:Arial,sans-serif;
    font-size:8px;
    letter-spacing:2px;
    cursor:pointer;
    transition:.25s;
}

.review-button:hover{
    background:#91b2e3;
}

#reviewMessage{
    font-family:Arial,sans-serif;
    font-size:9px;
    color:#91b2e3;
    margin-top:10px;
}


/* REVIEW LIST */

.review-list{
    display:grid;
}

.review-item{
    padding:24px 0;
    border-bottom:1px solid #192130;
}

.review-item:first-child{
    border-top:1px solid #192130;
}

.review-head{
    display:flex;
    align-items:center;
    justify-content:space-between;
    margin-bottom:10px;
}

.review-name{
    font-family:Georgia,"Times New Roman",serif;
    font-size:16px;
    color:#dce2ea;
}

.review-date{
    font-family:Arial,sans-serif;
    font-size:8px;
    letter-spacing:1px;
    color:#46536a;
}

.review-text{
    font-family:Arial,sans-serif;
    font-size:11px;
    line-height:1.8;
    color:#788598;
}

.empty-reviews{
    padding:25px 0;
    font-family:Arial,sans-serif;
    font-size:9px;
    letter-spacing:2px;
    color:#46536a;
}


/* STATUS */

.status{
    text-align:center;
    padding:80px 0;
    font-family:Arial,sans-serif;
    font-size:9px;
    letter-spacing:3px;
    color:#68758a;
}


/* MOBILE */

@media(max-width:650px){

    header{
        height:70px;
        padding:0 6%;
    }

    .logo{
        font-size:20px;
    }

    main{
        width:88%;
        padding:75px 0 55px;
    }

    h1{
        font-size:52px;
        letter-spacing:-3px;
    }

    .content{
        font-size:16px;
        line-height:1.9;
    }

    .reviews{
        width:88%;
        margin-bottom:80px;
    }

    .review-bottom{
        align-items:flex-start;
        flex-direction:column;
        gap:15px;
    }

    .review-button{
        width:100%;
    }

}

</style>
</head>


<body>


<header>

    <div class="logo">
        The<span>Notebook</span>
    </div>

    <a href="index.html" class="back">
        ← BACK
    </a>

</header>


<main id="entry">

    <div class="status">
        OPENING...
    </div>

</main>


<section class="reviews">

    <div class="reviews-top">

        <h2 class="reviews-title">
            Thoughts
        </h2>

        <span
            id="reviewCount"
            class="review-count"
        >
            00
        </span>

    </div>


    <div class="review-write">

        <input
            id="reviewName"
            class="review-input"
            type="text"
            placeholder="Your name"
        >

        <textarea
            id="reviewContent"
            class="review-textarea"
            placeholder="Leave a thought..."
        ></textarea>


        <div class="review-bottom">

            <span class="review-hint">
                A quiet space for thoughts.
            </span>

            <button
                id="reviewButton"
                class="review-button"
                type="button"
            >
                POST
            </button>

        </div>

        <p id="reviewMessage"></p>

    </div>


    <div
        id="reviewList"
        class="review-list"
    ></div>

</section>


<script>

const API =
    "https://thenotebook-production-fa3e.up.railway.app/api/blogs";


const entry =
    document.getElementById("entry");


const params =
    new URLSearchParams(
        window.location.search
    );


const id =
    params.get("id");


/* =========================
   VISITOR ID
========================= */

function getVisitorId(){

    const storageKey =
        "thenotebook_visitor_id";


    let visitorId =
        localStorage.getItem(
            storageKey
        );


    if(!visitorId){

        visitorId =
            "visitor_" +
            crypto.randomUUID();


        localStorage.setItem(
            storageKey,
            visitorId
        );

    }


    return visitorId;

}


const visitorId =
    getVisitorId();


/* =========================
   BLOG
========================= */

async function loadEntry(){

    if(!id){

        entry.innerHTML = `

            <div class="status">

                NO ENTRY SELECTED.

                <br><br>

                <a
                    href="index.html"
                    style="
                        color:#91b2e3;
                        text-decoration:none;
                    "
                >
                    ← BACK
                </a>

            </div>

        `;

        return;
    }


    try{

        const response =
            await fetch(
                API + "/" +
                encodeURIComponent(id)
            );


        const blog =
            await response.json();


        if(!response.ok){

            throw new Error(
                blog.error ||
                "Entry not found"
            );

        }


        document.title =
            blog.title +
            " — TheNotebook";


        entry.innerHTML = `

            <div class="category">

                ${escapeHTML(
                    blog.category ||
                    "Journal"
                ).toUpperCase()}

            </div>


            <h1>

                ${escapeHTML(
                    blog.title
                )}

            </h1>


            <div class="date">

                ${formatDate(
                    blog.created_at
                )}

            </div>


            <div class="like-wrap">

                <button
                    id="likeButton"
                    class="like-button"
                    type="button"
                    aria-label="Like this entry"
                >

                    <span
                        id="likeIcon"
                        class="like-icon"
                    >
                        ♡
                    </span>

                    <span
                        id="likeText"
                    >
                        LIKE
                    </span>

                    <span
                        id="likeCount"
                        class="like-count"
                    >
                        0
                    </span>

                </button>

            </div>


            <div class="line"></div>


            <div class="content">

                ${escapeHTML(
                    blog.content
                )}

            </div>

        `;


        setupLikeButton();

        loadLikes();

        loadReviews();

    }
    catch(error){

        console.error(error);

        entry.innerHTML = `

            <div class="status">

                ENTRY COULD NOT BE OPENED.

                <br><br>

                <a
                    href="index.html"
                    style="
                        color:#91b2e3;
                        text-decoration:none;
                    "
                >
                    ← RETURN
                </a>

            </div>

        `;

    }

}


/* =========================
   LIKES
========================= */

function setupLikeButton(){

    const likeButton =
        document.getElementById(
            "likeButton"
        );


    if(!likeButton){

        return;

    }


    likeButton.addEventListener(
        "click",
        toggleLike
    );

}


async function loadLikes(){

    try{

        const response =
            await fetch(
                API + "/" +
                encodeURIComponent(id) +
                "/likes?visitor_id=" +
                encodeURIComponent(visitorId)
            );


        const data =
            await response.json();


        if(!response.ok){

            throw new Error(
                data.error ||
                "Unable to load likes."
            );

        }


        updateLikeUI(
            data.count,
            data.liked
        );

    }
    catch(error){

        console.error(
            "Likes error:",
            error
        );

    }

}


async function toggleLike(){

    const likeButton =
        document.getElementById(
            "likeButton"
        );


    if(!likeButton || likeButton.disabled){

        return;

    }


    const currentlyLiked =
        likeButton.classList.contains(
            "liked"
        );


    likeButton.disabled = true;


    try{

        const response =
            await fetch(
                API + "/" +
                encodeURIComponent(id) +
                "/likes",
                {
                    method:
                        currentlyLiked
                            ? "DELETE"
                            : "POST",

                    headers:{
                        "Content-Type":
                            "application/json"
                    },

                    body:JSON.stringify({
                        visitor_id:
                            visitorId
                    })
                }
            );


        const data =
            await response.json();


        if(!response.ok){

            throw new Error(
                data.error ||
                "Unable to update like."
            );

        }


        updateLikeUI(
            data.count,
            data.liked
        );

    }
    catch(error){

        console.error(
            "Like error:",
            error
        );

    }
    finally{

        likeButton.disabled =
            false;

    }

}


function updateLikeUI(
    count,
    liked
){

    const likeButton =
        document.getElementById(
            "likeButton"
        );


    const likeIcon =
        document.getElementById(
            "likeIcon"
        );


    const likeText =
        document.getElementById(
            "likeText"
        );


    const likeCount =
        document.getElementById(
            "likeCount"
        );


    if(
        !likeButton ||
        !likeIcon ||
        !likeText ||
        !likeCount
    ){

        return;

    }


    likeCount.textContent =
        String(count || 0);


    if(liked){

        likeButton.classList.add(
            "liked"
        );

        likeIcon.textContent =
            "♥";

        likeText.textContent =
            "LIKED";

        likeButton.setAttribute(
            "aria-label",
            "Unlike this entry"
        );

    }
    else{

        likeButton.classList.remove(
            "liked"
        );

        likeIcon.textContent =
            "♡";

        likeText.textContent =
            "LIKE";

        likeButton.setAttribute(
            "aria-label",
            "Like this entry"
        );

    }

}


/* =========================
   REVIEWS
========================= */

const reviewName =
    document.getElementById(
        "reviewName"
    );


const reviewContent =
    document.getElementById(
        "reviewContent"
    );


const reviewButton =
    document.getElementById(
        "reviewButton"
    );


const reviewMessage =
    document.getElementById(
        "reviewMessage"
    );


const reviewList =
    document.getElementById(
        "reviewList"
    );


const reviewCount =
    document.getElementById(
        "reviewCount"
    );


async function loadReviews(){

    try{

        const response =
            await fetch(
                API + "/" +
                encodeURIComponent(id) +
                "/reviews"
            );


        const reviews =
            await response.json();


        if(!response.ok){

            throw new Error();

        }


        reviewList.innerHTML = "";


        reviewCount.textContent =
            String(
                reviews.length
            ).padStart(2,"0");


        if(reviews.length === 0){

            reviewList.innerHTML = `

                <div class="empty-reviews">

                    NO THOUGHTS YET.

                </div>

            `;

            return;
        }


        reviews.forEach(
            review => {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "review-item";


                item.innerHTML = `

                    <div class="review-head">

                        <span class="review-name">

                            ${escapeHTML(
                                review.name
                            )}

                        </span>

                        <span class="review-date">

                            ${formatDate(
                                review.created_at
                            )}

                        </span>

                    </div>


                    <div class="review-text">

                        ${escapeHTML(
                            review.content
                        )}

                    </div>

                `;


                reviewList.appendChild(
                    item
                );

            }
        );

    }
    catch(error){

        console.error(
            "Reviews error:",
            error
        );

    }

}


/* =========================
   POST REVIEW
========================= */

reviewButton.addEventListener(
    "click",
    async function(){

        const name =
            reviewName.value.trim();


        const content =
            reviewContent.value.trim();


        if(!name || !content){

            reviewMessage.textContent =
                "Please complete both fields.";

            return;

        }


        reviewButton.disabled = true;

        reviewButton.textContent =
            "POSTING...";


        try{

            const response =
                await fetch(
                    API + "/" +
                    encodeURIComponent(id) +
                    "/reviews",
                    {
                        method:"POST",

                        headers:{
                            "Content-Type":
                            "application/json"
                        },

                        body:JSON.stringify({
                            name,
                            content
                        })
                    }
                );


            const data =
                await response.json();


            if(!response.ok){

                throw new Error(
                    data.error ||
                    "Unable to post."
                );

            }


            reviewName.value = "";

            reviewContent.value = "";

            reviewMessage.textContent =
                "Posted.";


            await loadReviews();

        }
        catch(error){

            console.error(error);

            reviewMessage.textContent =
                "Unable to post.";

        }
        finally{

            reviewButton.disabled =
                false;

            reviewButton.textContent =
                "POST";

        }

    }
);


/* =========================
   HELPERS
========================= */

function escapeHTML(text){

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        text || "";

    return div.innerHTML;

}


function formatDate(date){

    if(!date) return "";

    return new Date(date)
        .toLocaleDateString(
            undefined,
            {
                day:"numeric",
                month:"long",
                year:"numeric"
            }
        );

}


/* =========================
   START
========================= */

loadEntry();

</script>

</body>
</html>
