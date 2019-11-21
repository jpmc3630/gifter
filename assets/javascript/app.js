let selectedGif = "https://media1.giphy.com/media/eNTxLwTGW7E64/200.gif";
let leHeight = 208;
let leWidth = 275;
let fontSize = 20;

let fontColor = '#7fffd4';
let textPos;

let search;
let notAtMax = true;

let gifList = [
    'maniac mansion',
    'day of the tentacle',
    'sam and max',
    'monkey island',
    'leisure suit larry',
    'full throttle',
    'indiana jones',
    'myst'
];


$(document).ready(function() {
    LoadButtons();

})


// uses giflib to split the GIF frame by frame and draw on DOM

$("#booyah").on("click", function(event) {

    $('#loading').css('display', 'block');
    $('#download-div').css('display', 'none');
    // $("#frames").html("");
    $('#peek').attr('src', selectedGif);


    $('#peek').each(function (idx, img_tag) {

        resetStage(); //clear things up again

        if (/^.+\.gif$/.test($(img_tag).prop("src"))) {
          var rub = new SuperGif({ gif: img_tag, progressbar_height: 0 } );
          rub.load(function(){
            for (var i = 0; i < rub.get_length(); i++)
            {
                 //console.log(i);
               rub.move_to(i); 
               var canvas = cloneCanvas(rub.get_canvas());
               $("#frames").append(canvas);
            }

            gifBuildFunction();
          });
        }
      });
    });


// takes giflibs split array on DOM and runs gifshot to make the gif
function gifBuildFunction() {
    fontSize = $('#font-size').val();
    if (!fontSize.includes('px')) {
        fontSize = fontSize + 'px';    
    }

    let textMe = $('#text-to-add').val();
    let textPos = $("#text-pos").val();
    let myNodeList = document.querySelectorAll("canvas");
    // Turn 'canvas' node list into an array
   let nodeListArr = [];
    console.log(myNodeList);
    for (data of myNodeList) nodeListArr.push(data);

    // Run the gifshot create gif from canvas node array
    let createGIF = function() {
        gifshot.createGIF({
            'images' : nodeListArr,
            'gifHeight' : leHeight,
            'gifWidth' : leWidth,
            'text' : textMe,
            'textBaseline' : textPos,
            'fontSize': fontSize,
            'fontColor': fontColor
            
            // 'fontFamily': 'sans-serif'
        }, function(obj) {
            
        if (!obj.error) {
            let image = obj.image,
            animatedImage = document.getElementById('preview');
            animatedImage.src = image;
        } else {
            console.log(obj);
        }
        $('#loading').css('display', 'none');  //hide loading...
        $('#download-div').css('display', 'block');
        })
    };
    
    createGIF();
}


function setTextColor(picker) {
    fontColor = '#' + picker.toString()
}

$("#text-to-add").on("click", function(event) {
    document.getElementById("text-to-add").select();
});


$("#downloadbutton").on("click", function(event) {

    let item = $('#preview').attr('src');
    let a = document.createElement('a')
    a.href = item
    a.download = 'GIFter.gif';
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
});


// adds a new topic button ready for searching
$("#find-gif").on("click", function(event) {
        
    event.preventDefault();
    
    if ($("#gif-input").val().trim() != "") {
    
        var gif = $("#gif-input").val();
        gifList.push(gif);
        
        LoadButtons();

        search = $("#gif-input").val().trim();
        RunSearch();
        
        document.getElementById("gif-input").select();
    } else {
        $('#gif-input').val('Enter something!');
        document.getElementById("gif-input").select();
    }
});

$('#gif-input').on("click", function(event) {
    document.getElementById("gif-input").select();
});

// gif ajax call
$(document).on('click', '.gif-button', function (){

    search = $(this).text();
    RunSearch();

});

function RunSearch() {
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
    search + "&api_key=BkaUZZWcFij6J7AoQj3WtPb1R2p9O6V9&limit=10";

    $.ajax({
    url: queryURL,
    method: "GET"
    })
    .then(function(response) {
        
        console.log(response);
        var results = response.data;

        if (results.length == 0) {
            $("#gif-view").html("No results found. Please try again!");
        } else {
            $("#gif-view").html("");

            for (var i = 0; i < results.length; i++) {
            var gifDiv = $("<div>");

            var rating = results[i].rating;

            var p = $("<p>").text("Rating: " + rating);

            var personImage = $(`

            <img src="${results[i].images.fixed_height_still.url}" 
            data-still="${results[i].images.fixed_height_still.url}" 
            data-animate="${results[i].images.fixed_height.url}" 
            data-state="still" 
            class="gif-image">`);

            personImage.attr("src", results[i].images.fixed_height_still.url);

            gifDiv.prepend(p);
            gifDiv.prepend(personImage);
            
            $("#gif-view").append(gifDiv);
            }
            notAtMax = true;
            $("#gif-view").append(`<input type="button" id="loadmore-button" class="btn btn-dark btn-sm" value="Load more GIFs!" onClick="moreContent();"></input>`);
        }
    });
}

// our gif menu click
$(document).on('click', '.gif-image', function (){

    $('#download-div').css('display', 'none');
    let state = $(this).attr('data-state');
    
    if (state == "still") {
        let newSrc = $(this).attr('data-animate');
        $(this).attr('src', newSrc);
        $(this).attr('data-state', 'animate');
    }

    if (state == "animate") {
        let newSrc = $(this).attr('data-still');
        $(this).attr('src', newSrc);
        $(this).attr('data-state', 'still');
    }

    $('.gif-image').css('border', 'none');
    $(this).css('border', 'aquamarine solid 4px');

    selectedGif = $(this).attr('data-animate');
    $('#peek').attr('src', selectedGif);
    $('#preview').attr('src', selectedGif);
    leHeight = parseInt($(this).css('height'));
    leWidth = parseInt($(this).css('width'));

});

// Make search history buttons pretty
  function capWords(str)
{
return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

// Load search history buttons from array
function LoadButtons() {
    $('#buttonDiv').html('');
    for (let i = 0; i < gifList.length; i++) {

        let newButton=$('<button class="gif-button btn btn-dark btn-sm">');
        let buttonTitle=capWords(gifList[i]);
          newButton.text(buttonTitle);
        $('#buttonDiv').append(newButton);
    }
}



$(window).scroll(function() {
    if($(window).scrollTop() == $(document).height() - $(window).height()) {
        moreContent();
    }
});


function moreContent() {
    if(notAtMax) {
        // ajax call get data from server and append to the div
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
        search + "&api_key=BkaUZZWcFij6J7AoQj3WtPb1R2p9O6V9";

        $.ajax({
        url: queryURL,
        method: "GET"
        })
        .then(function(response) {
            
           
            var results = response.data;

        // just from 10 onwards this time
            for (var i = 10; i < results.length; i++) {
            var gifDiv = $("<div>");

            var rating = results[i].rating;

            var p = $("<p>").text("Rating: " + rating);

            var personImage = $(`

            <img src="${results[i].images.fixed_height_still.url}" 
            data-still="${results[i].images.fixed_height_still.url}" 
            data-animate="${results[i].images.fixed_height.url}" 
            data-state="still" 
            class="gif-image">`);

            personImage.attr("src", results[i].images.fixed_height_still.url);

            gifDiv.prepend(p);
            gifDiv.prepend(personImage);
            
            $("#gif-view").append(gifDiv);
            }

            notAtMax = false;
            
            $('#loadmore-button').css('display', 'none');

        });
    }
    
}


// the button that resets the stage
function resetStage() {

    $('.stage').html(`
            <img id="peek" src=""/>
            <div id="frames"></div>
    `);
    }

// this function clones the next frame in the gif split
function cloneCanvas(oldCanvas) {
    
    //create a new canvas
    var newCanvas = document.createElement('canvas');
    var context = newCanvas.getContext('2d');

    //set dimensions
    newCanvas.width = oldCanvas.width;
    newCanvas.height = oldCanvas.height;

    //apply the old canvas to the new one
    context.drawImage(oldCanvas, 0, 0);

    //return the new canvas
    return newCanvas;
}