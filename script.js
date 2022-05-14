let background = document.getElementById('bg')
let navigationBar = document.getElementById('navigation-bar')
let startBtn = document.getElementById('start-btn')
let startMenu = document.getElementById('start-menu')

async function load(){
    setTimeout(function(){
        background.style.animation = 'bg-startup 1s ease';
        background.style.visibility = 'visible';
        navigationBar.style.visibility = 'visible'
        navigationBar.style.animation = 'navigation-startup 1s'
    }, 1000)

    let link = 'https://api.openweathermap.org/data/2.5/weather?q=New%20York&units=metric&appid=4d5f7aaa82a113cc7d13bcaab9d3ac1a'

    let weatherInfo = await (await fetch(link)).json()
    console.log(weatherInfo)
    document.querySelectorAll('.weather-icon').forEach(icon => {
        icon.setAttribute('src', `http://openweathermap.org/img/wn/${weatherInfo.weather[0].icon}.png`)
    })

    document.querySelectorAll('.weather-temp').forEach(element => {
        element.innerHTML = `${Math.floor(parseInt(weatherInfo.main.temp))}°`
    })
    document.querySelectorAll('.weather-description').forEach(element => {
        let weather_description = weatherInfo.weather[0].description.split(' ')
        let weather_capitalized = []

        for (let i = 0; i < weather_description.length; i++){
            weather_capitalized.push(`${weather_description[i][0].toUpperCase()}${weather_description[i].replace(weather_description[i][0], '')}`)
        }

        element.innerHTML = weather_capitalized.join(' ')
    })
}

startBtn.addEventListener('click', function(){
    console.log('a')
    if (startMenu.classList.contains('show')){
        startMenu.classList.remove('show')
        startMenu.classList.add('hide')
    }else if (startMenu.classList.contains('hide')){
        startMenu.classList.remove('hide')
        startMenu.classList.add('show')
    }else{
        startMenu.classList.add('show')
    }
})

let i = 0;

function openWindow(application){
    if (application == 'File') {
        i++
        let windowInnerHTML = 
        `
    <div class="resizer resizer-${i} n"></div>
    <div class="resizer resizer-${i} s"></div>
    <div class="resizer resizer-${i} e"></div>
    <div class="resizer resizer-${i} w"></div>
    <div class="resizer resizer-${i} ne"></div>
    <div class="resizer resizer-${i} nw"></div>
    <div class="resizer resizer-${i} sw"></div>
    <div class="resizer resizer-${i} se"></div>
    <div class="title-bar">
        <div class="tab-container">
            <div class="title">Files</div>
            <div class="plus">+</div>
        </div>
        <div class="actions">
            <div>
                <div class="dock-left"><img src="assets/icons/Dock left.svg"></div>
                <div class="merge"><img src="assets/icons/Merge.svg"></div>
                <div class="dock-right"><img src="assets/icons/Dock right.svg"></div>
            </div>
            <div>
                <div class="expand"><img src="assets/icons/expand.png"></div>
                <div class="shrink"><img src="assets/icons/minimize.png"></div>
                <div class="close"><img src="assets/icons/close.svg"></div>
            </div>
        </div>
    </div>
    <div class="content">
        <div class="title-search">
            <h2 class="title">Files</h2>
            <input type="text" class="files-search" placeholder="Type here to search...">
        </div>
        <div class="folders-recently-opened">
            <div class="folders">
                <div class="favorites">
                    <h4>Favorites</h4>
                    <div class="favorites-icon">
                        <div class="documents"></div>
                        <div class="downloads"></div>
                        <div class="applications"></div>
                        <div class="desktop"></div>
                        <div class="recents"></div>
                    </div>
                </div>
                <div class="pinned"></div>
                <div class="tags"></div>
            </div>
            <div class="recently-opened-recommended">
                <div class="recently-opened">a</div>
                <div class="recommended">a</div>
            </div>
        </div>
        `
        let applications = document.getElementById('applications')
        let element = document.createElement('div')


        element.setAttribute('class', `window window-${i}`)
        element.innerHTML = windowInnerHTML

        applications.appendChild(element)
        draggable(document.querySelector(`.window.window-${i}`), document.querySelector(`.window.window-${i} .title-bar`), i)
        titlebarActions(document.querySelector(`.window.window-${i}`))

        const titlebars = document.querySelectorAll(`.window .title-bar`)
        const winboxes = document.querySelectorAll('.window')
        const winbox = document.querySelector(`.window.window-${i}`)

        winboxes.forEach(windowes => {
            windowes.addEventListener('mousedown', function(){
                winboxes.forEach(win => {
                    win.classList.remove('active')
                })

                windowes.classList.add('active')
            })
        })
    }
}

function titlebarActions(winbox){
    const close = winbox.querySelector('.title-bar .actions div .close')
    const shrink = winbox.querySelector('.title-bar .actions div .shrink')
    const expand = winbox.querySelector('.title-bar .actions div .expand')

    close.addEventListener('click', function(){
        winbox.style.animation = 'winboxClose 0.5s';
        setTimeout(() => winbox.remove(), 500)
    })
}

function draggable(el, titlebar, i){

    titlebar.addEventListener('mousedown', mousedown)

    function mousedown(e){
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        
        pos3 = e.clientX;
        pos4 = e.clientY;

        document.onmouseup = mouseup;
        document.onmousemove = mousemove;

        function mousemove(e){
            e = e || window.event;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            el.style.top = (el.offsetTop - pos2) + "px";
            el.style.left = (el.offsetLeft - pos1) + "px";
        }
        
        function mouseup(){
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    const resizers = document.querySelectorAll(`.resizer.resizer-${i}`);
    let currentResizer;
    
    for (let resizer of resizers){
        resizer.addEventListener('mousedown', mousedown);

        function mousedown(e){
            currentResizer = e.target;

            let prevX = e.clientX;
            let prevY = e.clientY;

            window.addEventListener('mousemove', mousemove)
            window.addEventListener('mouseup', mouseup)

            function mousedown() {
                let newX = prevX - e.clientX;
                let newY = prevY - e.clientY;

                const rect = el.getBoundingClientRect();

                el.style.left = rect.left - newX + "px";
                el.style.top = rect.top - newY + "px";

                prevX = e.clientX;
                prevY = e.clientY;
            }

            function mousemove(e){
                const rect = el.getBoundingClientRect();

                if (currentResizer.classList.contains('se')){
                    el.style.width = rect.width - (prevX - e.clientX) + 'px';
                    el.style.height = rect.height - (prevY - e.clientY) + 'px';
                } else if (currentResizer.classList.contains('sw')) {
                    el.style.width = rect.width + (prevX - e.clientX) + 'px';
                    el.style.height = rect.height - (prevY - e.clientY) + 'px';
                    el.style.left = rect.left - (prevX - e.clientX) + 'px';
                } else if (currentResizer.classList.contains('ne')) {
                    el.style.width = rect.width - (prevX - e.clientX) + 'px';
                    el.style.height = rect.height + (prevY - e.clientY) + 'px';
                    el.style.top = rect.top - (prevY - e.clientY) + 'px';
                } else if (currentResizer.classList.contains('nw')) {
                    el.style.width = rect.width + (prevX - e.clientX) + 'px';
                    el.style.height = rect.height + (prevY - e.clientY) + 'px';
                    el.style.top = rect.top - (prevY - e.clientY) + 'px';
                    el.style.left = rect.left - (prevX - e.clientX) + 'px';
                } else if (currentResizer.classList.contains('n')) {
                    el.style.height = rect.height + (prevY - e.clientY) + 'px';
                    el.style.top = rect.top - (prevY - e.clientY) + 'px';
                } else if (currentResizer.classList.contains('w')) {
                    el.style.width = rect.width + (prevX - e.clientX) + 'px';
                    el.style.left = rect.left - (prevX - e.clientX) + 'px';
                } else if (currentResizer.classList.contains('s')) {
                    el.style.height = rect.height - (prevY - e.clientY) + 'px';
                } else if (currentResizer.classList.contains('e')) {
                    el.style.width = rect.width - (prevX - e.clientX) + 'px';
                } 

                prevX = e.clientX;
                prevY = e.clientY;
            }

            function mouseup(){
                window.removeEventListener('mousemove', mousemove)
                window.removeEventListener('mouseup', mouseup)
            }
        }
    }
}
load()
