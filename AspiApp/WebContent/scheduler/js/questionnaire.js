var app = angular.module('QuestionarioApp', []); 

app.config(['$locationProvider',function ($locationProvider) {
	$locationProvider.html5Mode({enabled : true, requireBase: false});
}])

app.controller('QuestionarioCtrl', function($scope,$http,$location,$window) {
    
    var url = 'http://localhost:8080/SurveyWSRest/rest/question/';
    $scope.answers = [];
    
    $scope.showquestion = [];
    $scope.question_answered = [];
    
    var customer_id = $location.search().customer; 
    
    
    $http.get(url+"getall").
    	then(function(response) {
    		$scope.questions = response.data;    		    	
    	});
    $scope.chanceChoice = function(choice) {
    	
    	var obj = angular.fromJson(choice);
    	
    	
    	delAnswers(obj.question_id, $scope.answers);
    	
    	addAnswer (obj, $scope.questions, $scope.answers);
    	
    	$scope.showquestion = [];
    	$scope.question_answered = [];
    	
    	angular.forEach($scope.answers, function(value, key){
    		$scope.question_answered[value.questionId] = "YES";
    		
    		$scope.showquestion[value.answerId] = "YES";    		
    	});
    	
    	
    	console.log($scope.answers);
    	
    };
    $scope.blur = function(question,answer) {
    	delAnswers(question.id, $scope.answers);
    	if(answer != null && answer.length > 0) {
    		$scope.question_answered[question.id] = "YES";
    		addAnswerText(question, answer, $scope.answers);
    	} else {
    		$scope.question_answered[question.id] = "NO";
    	}    	
    	
    }
    $scope.save = function() {
    	var answer = {"customer_id":customer_id,"detail":$scope.answers};
    	$http.post(url+"save",angular.fromJson(answer)).    	
    	then(function(response) {
    		console.log("resultado save: "+response.data);
    		if(response.data == 0) {
    			$window.location.href = "obrigado.html";	    			
    		} else {
    			alert('Erro ao salvar questionario!');
    		}
    	});
    }
});


function delAnswers (questionId, listAnswers) {
	
	angular.forEach(listAnswers, function(value, key){
		if(value.questionId == questionId) {
			delAnswers(value.questionchild, listAnswers);
			listAnswers.splice(listAnswers.indexOf(value),1);
		} 		
	});
	
	

}


function addAnswerText(question,answer,listAnswer) {
	var obj = {"questionId":question.id,"questionText":question.description,"answerId":0,"answerText":answer,"questionchild":0,"multiple_choice":0};
	listAnswer.push(obj);
	
	
}
function addAnswer(choice, listQuestion, listAnswer) {
	var answer = {"questionId":choice.question_id,"questionText":"","answerId":choice.id,"answerText":choice.description,"questionchild":0,"multiple_choice":1};
	angular.forEach(listQuestion, function(value, key){
		if(value.parent_answer == choice.id) {
			answer.questionchild = value.id;			
		} 		
		if(value.id == choice.question_id) {
			answer.questionText = value.description;			
		}
	});
	listAnswer.push(answer);		
}