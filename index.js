"use strict";

var Alexa = require("alexa-sdk");

var handlers = {
  
  // If skill is launched with the phrase 'I gave my {pet} her {med}' - gives confirmation message
  // and saves details to the session attributes
  'GiveMedIntent': function () {
    this.attributes['myPet'] = this.event.request.intent.slots.petIdentifier.value;
    this.attributes['myMed'] = this.event.request.intent.slots.medIdentifier.value;
    this.attributes['myDate'] = new Date().toString().substring(0, 15);
    this.response.speak(`OK. I got that you just gave your ${this.attributes.myPet} ${this.attributes.myMed} on ${this.attributes.myDate}`);
    this.emit(':responseReady');
    console.log(this.attributes);
  },
  
  // On launching the skill without the GiveMed intent - if no information about the pet, then gives 
  // appropriate message, otherwise reports on the saved attributes
  'LaunchRequest': function () {
    if (Object.keys(this.attributes).length === 0) {
      this.response.speak(`I don't have any information about your pet. Say "help" if you need some help with using Pet Med Minder.`);
    } else {
      this.response.speak(`You last gave your ${this.attributes.myPet} ${this.attributes.myMed} on ${this.attributes.myDate}`);
    }
    this.emit(':responseReady');
  },
    
  // Help
  'AMAZON.HelpIntent': function() {
    this.response.speak(`You can ask Pet Med Minder to remember when you gave your pet its medicine. For example, you could say, “Alexa, tell Pet Med Minder that I gave my cat her flea treatment.”`);
    this.emit(':responseReady');
  },
  
  // Stop
  'AMAZON.StopIntent': function() {
    this.response.speak(`OK. Thanks for using Pet Med Minder.`);
    this.emit(':responseReady');
  },

  // Cancel
  'AMAZON.CancelIntent': function() {
    this.response.speak(`OK. Thanks for using Pet Med Minder.`);
    this.emit(':responseReady');
  },

  // Save state
  'SessionEndedRequest': function() {
    this.emit(':saveState', true);
  }
};

exports.handler = function(event, context, callback){
    var alexa = Alexa.handler(event, context);
    alexa.dynamoDBTableName = 'petMedMinderSession';
    alexa.registerHandlers(handlers);
    alexa.execute();
};