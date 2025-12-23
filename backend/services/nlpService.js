import winkNlp from "wink-nlp";
import model from "wink-eng-lite-web-model";
import compromise from "compromise";

/**
 * Handles intent detection and entity extraction from user messages.
 */
class NLPService {
  constructor() {
    this.nlp = winkNlp(model);
    this.its = this.nlp.its;
    this.as = this.nlp.as;

    this.intentClassifiers = {
      greeting: {
        patterns: [
          "hi",
          "hello",
          "hey",
          "good morning",
          "good evening",
          "greetings",
          "howdy",
        ],
        keywords: ["hi", "hello", "hey", "morning", "evening", "greet"],
      },
      goodbye: {
        patterns: [
          "bye",
          "goodbye",
          "see you",
          "farewell",
          "take care",
          "catch you later",
        ],
        keywords: ["bye", "goodbye", "farewell", "later", "leave"],
      },
      thanks: {
        patterns: [
          "thank",
          "thanks",
          "thank you",
          "appreciate",
          "grateful",
          "thx",
        ],
        keywords: ["thank", "appreciate", "grateful"],
      },
      yes: {
        patterns: [
          "yes",
          "yeah",
          "yep",
          "sure",
          "okay",
          "ok",
          "correct",
          "right",
          "affirmative",
          "absolutely",
        ],
        keywords: ["yes", "yeah", "sure", "ok", "correct", "right"],
      },
      no: {
        patterns: [
          "no",
          "nope",
          "nah",
          "not really",
          "never",
          "negative",
          "disagree",
        ],
        keywords: ["no", "nope", "not", "never", "negative"],
      },
      help: {
        patterns: [
          "help",
          "assist",
          "support",
          "stuck",
          "confused",
          "need help",
          "don't understand",
        ],
        keywords: ["help", "assist", "support", "stuck", "confused"],
      },
      order: {
        patterns: [
          "order",
          "buy",
          "purchase",
          "get",
          "want to buy",
          "i want",
          "looking for",
        ],
        keywords: ["order", "buy", "purchase", "want", "get"],
      },
      cancel: {
        patterns: [
          "cancel",
          "stop",
          "abort",
          "quit",
          "exit",
          "end",
          "terminate",
        ],
        keywords: ["cancel", "stop", "abort", "quit", "exit"],
      },
      confirm: {
        patterns: [
          "confirm",
          "proceed",
          "continue",
          "go ahead",
          "lets do it",
          "proceed",
        ],
        keywords: ["confirm", "proceed", "continue", "ahead"],
      },
    };

    this.workflowIntents = new Map();
  }

  /**
   * Analyze user message
   */
  async analyzeMessage(message, workflowId) {
    const doc = this.nlp.readDoc(message);

    //tokenization and POS tagging
    const tokens = doc.tokens().out();
    const sentences = doc.sentences().out();

    // detect intent
    const intent = this.detectIntent(message, doc, workflowId);

    //extract entities
    const entities = this.extractEntities(message, doc);

    //sentiment analysis
    const sentiment = this.analyzeSentiment(doc);

    //calculate confidence
    const confidence = this.calculateConfidence(intent, entities, doc);

    return {
      intent,
      entities,
      confidence,
      tokens,
      sentences,
      metadata: {
        wordCount: tokens.length(),
        sentenceCount: sentences.length(),
      },
    };
  }

  /**
   * detect intent from message, using pattern matching and keyword scoring
   */
  async detectIntent(message, doc, workflowId) {
    const normalizedMessage = message.toLowerCase().trim();
    let bestIntent = "unknown";
    let bestScore = 0;

    if (workflowId && this.workflowIntents.has(workflowId)) {
      const customIntents = this.workflowIntents.get(workflowId);
      const customResult = this.matchIntents(normalizedMessage, customIntents);
      if (customResult.score > bestScore) {
        bestScore = customResult.score;
        bestIntent = customResult.intent;
      }
    }

    for (const [intent, classifier] of Object.entries(this.intentClassifiers)) {
      const score = this.calculateIntentScore(normalizedMessage, classifier);
      if (score > bestScore) {
        bestScore = score;
        bestIntent = intent;
      }
    }

    return bestScore > 0.3 ? bestIntent : "unknown";
  }

  /**
   * calculate intent score based on pattern and keyword matches
   */
  calculateConfidenceScore(message, classifier) {
    let score = 0;
    let matches = 0;

    for (const pattern of classifier.patterns) {
      if (message.includes(pattern.toLowerCase())) {
        score += pattern.length / message.length;
        matches++;
      }
    }

    const words = message.split(/\s+/);
    for (const keyword of classifier.keywords) {
      if (words.includes(keyword)) {
        score += 0.1;
        matches++;
      }
    }

    if (matches > 0) {
      score *= 1.2;
    }

    return Math.min(score, 1.0);
  }

  /**
   * match against custom workflow intents
   */
  matchCustomIntents(message, customIntents) {
    let bestIntent = "unknown";
    let bestScore = 0;

    for (const [intentName, examples] of Object.entries(customIntents)) {
      for (const example of examples) {
        const similarity = this.calculateSimilarity(
          message,
          example.toLowerCase()
        );
        if (similarity > bestScore) {
          bestScore = similarity;
          bestIntent = intentName;
        }
      }
    }

    return { intent: bestIntent, score: bestScore };
  }

  /**
   * calculate string similarity (simple jaccard index)
   */
  calculateSimilarity(str1, str2) {
    const set1 = new Set(str1.split(/\s+/));
    const set2 = new Set(str2.split(/\s+/));
    const intersection = new Set([...set1].filter((x) => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    return intersection.size / union.size;
  }

  /**
   * extract entities using compromise library
   */
  async extractEntities(message, doc) {
    const entities = {};

    const compromiseDoc = compromise(message);

    //extract people names
    const people = compromiseDoc.people().out("array");
    if (people.length > 0) {
      entities.people = people[0];
      entities.people = people;
    }

    //extract places
    const places = compromiseDoc.places().out("array");
    if (places.length > 0) {
      entities.place = places[0];
      entities.places = places;
    }

    //extract organizations
    const organizations = compromiseDoc.organizations().out("array");
    if (organizations.length > 0) {
      entities.organization = organizations[0];
      entities.organizations = organizations;
    }

    //extract dates using compromise
    const dates = compromiseDoc.dates().out("array");
    if (dates.length > 0) {
      entities.date = dates[0];
      entities.dates = dates;
    }

        // Extract numbers using winkNLP
    const numbers = doc.tokens()
      .filter((t) => t.out(this.its.type) === 'number')
      .out();
    if (numbers.length > 0) {
      entities.number = parseFloat(numbers[0]);
      entities.numbers = numbers.map(n => parseFloat(n));
    }

    // Extract emails using regex
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const emails = message.match(emailRegex);
    if (emails) {
      entities.email = emails[0];
      entities.emails = emails;
    }

    // Extract phone numbers
    const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
    const phones = message.match(phoneRegex);
    if (phones) {
      entities.phone = phones[0];
      entities.phones = phones;
    }

    // Extract URLs
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = message.match(urlRegex);
    if (urls) {
      entities.url = urls[0];
      entities.urls = urls;
    }

    // Extract currency amounts
    const amounts = compromiseDoc.money().out('array');
    if (amounts.length > 0) {
      entities.amount = amounts[0];
      entities.amounts = amounts;
    }

    return entities;
  }

  /**
   * calculate confidence score based on multiple factors
   */
  calculateConfidence(intent, entities, doc) {
    if(intent === 'unknown') return 0.2;

    let confidence = 0.6;  // base score for known intent

    const entityCount = Object.keys(entities).length;
    confidence += Math.min(entityCount * 0.05, 0.2);

    //boost for longer, well-formed sentences
    const tokens = doc.tokens().out();
    if(tokens.length > 3) {
        confidence += 0.1;
    }

    return Math.min(confidence, 1.0);

  }

  /**
   * Train custom intents for a workflow
   */
  async trainIntents(workflowId, intentsName, examples) {
    if(!this.workflowIntents.has(workflowId)) {
        this.workflowIntents.set(workflowId, {});
    }

    const workflowIntents  = this.workflowIntents.get(workflowId);
    workflowIntents[intentsName] = examples.map(ex => ex.toLowerCase().trim());

    return {
        success: true,
        workflow_Id: workflowId,
        intent: intentsName,
        examples: workflowIntents[intentsName],
    }
  }

  /**
   * GET WORKFLOW INTENTS
   */
  getWorkflowIntents(workflowId) {
    return this.workflowIntents.get(workflowId) || {};
  }

  /**
   * REMOVE WORKFLOW INTENTS (cleanup)
   */
  clearWorkflowIntents(workflowId) {
    this.workflowIntents.delete(workflowId);
  }

}

export default new NLPService();
