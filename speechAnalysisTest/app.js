//#region REQUIREMENTS
var fs = require('fs')
var readline = require('readline')
var rl = readline.createInterface({input : process.stdin, 
                                   output : process.stdout})
//#endregion

//#region FILES
var dictionaryAgent = getSpeakerDictionary('D:\\NodeJsProjects\\speechanalysisTest\\agent.txt')
var dictionaryCustomer = getSpeakerDictionary('D:\\NodeJsProjects\\speechanalysisTest\\customer.txt')
//#endregion

//#region MAKING DICTIONARY AND COUNTING WORDS
function getSpeakerDictionary(file) {

    var dictionary = {}

    var text = fs.readFileSync(file)
    var lines = text.toString().split('\r\n')

    function wordCounter(wordGroup) {
        if (dictionary[wordGroup]) {
            dictionary[wordGroup]++
        }
        else {
            dictionary[wordGroup] = 1
        }
    }
    lines.forEach(sentences => {
        var words = sentences.split(' ')
        words.forEach(word => {
            wordCounter(word)
        })
        for (let i = 0; i < words.length - 1; i++) {
            var doubleWord = words[i] + ' ' + words[i + 1]
            wordCounter(doubleWord)
        }
        for (let i = 0; i < words.length - 2; i++) {
            var tripleWord = words[i] + ' ' + words[i + 1] + ' ' + words[i + 2]
            wordCounter(tripleWord)
        }
    })
    
    //#region PUSHING DICTIONARY TO ARRAY AND SORTING
    var wordArray = []

    Object.keys(dictionary).forEach(dict => {
        wordArray.push({
            key: dict,
            value: dictionary[dict]
        })
    })
    wordArray.sort(function (a, b) {
        if (a.value > b.value) {
            return -1
        }
        return 1
    })
    // console.log(wordArray)
    return dictionary
    //#endregion

}
//#endregion

//#region GETTING SPEECH AND SCORING
function getSpeaker(lines) {
    var agentScore = 0
    var customerScore = 0

    function calculateScore(wordGroups,keyNumber) {
    if(dictionaryAgent[wordGroups]){
        agentScore += keyNumber*(dictionaryAgent[wordGroups])     
    }
    if(dictionaryCustomer[wordGroups]){
        customerScore += keyNumber*(dictionaryCustomer[wordGroups])     
    }    
}
    lines.forEach(sentences => {
        var words = sentences.split(' ')
        words.forEach(singleWord => {
            calculateScore(singleWord,1)
        })

        for (let i = 0; i < words.length - 1; i++) {
            var doubleWords = words[i] + ' ' + words[i + 1]
           calculateScore(doubleWords,2)
        }
        for (let i = 0; i < words.length - 2; i++) {
            var tripleWords = words[i] + ' ' + words[i + 1] + ' ' + words[i + 2]
            calculateScore(tripleWords,3)
        }
    })
    console.log("Agent Score: " + agentScore + " Customer Score: " + customerScore)
    return agentScore > customerScore ? 1 : (agentScore < customerScore ? 2 : 0)
}
//#endregion

//#region SPEECH TEST
function startTest(){
    rl.question('What is speech? \n', (userInput)=>{
        var result = getSpeaker([userInput])
    
        console.log("result= " + result)
        startTest()
        //rl.close()
    })
}
startTest()
//#endregion



