"use strict";

const dialogues = {};

class Dialogue {
    constructor({ name, 
                  starting_text = `Talk to ${name}`,
                  ending_text = `Return`,
                  is_unlocked = true, 
                  is_finished = false, 
                  textlines = {}, 
                  location_name,
    }) 
    {
        this.name = name; //displayed name, e.g. "Village elder"
        this.starting_text = starting_text;
        this.ending_text = ending_text; //text shown on option to finish talking
        this.is_unlocked = is_unlocked;
        this.is_finished = is_finished; //separate bool to remove dialogue option if it's finished
        this.textlines = textlines; //all the lines in dialogue

        this.location_name = location_name; //this is purely informative and wrong value shouldn't cause any actual issues
    }
}

class Textline {
    constructor({name,
                 text,
                 getText,
                 is_unlocked = true,
                 is_finished = false,
                 unlocks = {textlines: [],
                            locations: [],
                            dialogues: [],
                            traders: [],
                            stances: [],
                            flags: [],
                            items: [],
                            spec: [],
                            },
                locks_lines = {},
                otherUnlocks,
                required_flags,
            }) 
    {
        this.name = name; // displayed option to click, don't make it too long
        this.text = text; // what's shown after clicking
        this.getText = getText || function(){return this.text;};
        this.otherUnlocks = otherUnlocks || function(){return;};
        this.is_unlocked = is_unlocked;
        this.is_finished = is_finished;
        this.unlocks = unlocks || {};
        //this.spec = spec;
        
        this.unlocks.textlines = unlocks.textlines || [];
        this.unlocks.locations = unlocks.locations || [];
        this.unlocks.dialogues = unlocks.dialogues || [];
        this.unlocks.traders = unlocks.traders || [];
        this.unlocks.stances = unlocks.stances || [];
        this.unlocks.flags = unlocks.flags || [];
        this.unlocks.items = unlocks.items || []; //not so much unlocks as simply items that player will receive
        
        this.required_flags = required_flags;

        this.locks_lines = locks_lines;
        //related text lines that get locked; might be itself, might be some previous line 
        //e.g. line finishing quest would also lock line like "remind me what I was supposed to do"
        //should be alright if it's limited only to lines in same Dialogue
        //just make sure there won't be Dialogues with ALL lines unavailable
    }
}

(function(){
    dialogues["village elder"] = new Dialogue({
        name: "village elder",
        textlines: {
            "hello": new Textline({
                name: "Hello?",
                text: "Hello. Glad to see you got better",
                unlocks: {
                    textlines: [{dialogue: "village elder", lines: ["what happened", "where am i", "dont remember", "about"]}],
                },
                locks_lines: ["hello"],
            }),
            "what happened": new Textline({
                name: "My head hurts.. What happened?",
                text: `Some of our people found you unconscious in the forest, wounded and with nothing but pants and an old sword, so they brought you to our village. `
                + `It would seem you were on your way to a nearby town when someone attacked you and hit you really hard in the head.`,
                is_unlocked: false,
                locks_lines: ["what happened", "where am i", "dont remember"],
                unlocks: {
                    textlines: [{dialogue: "village elder", lines: ["ask to leave 1"]}],
                },
            }),
            "where am i": new Textline({
                name: "Where am I?",
                text: `Some of our people found you unconscious in the forest, wounded and with nothing but pants and an old sword, so they brought you to our village. `
                + `It would seem you were on your way to a nearby town when someone attacked you and hit you really hard in the head.`,
                is_unlocked: false,
                locks_lines: ["what happened", "where am i", "dont remember"],
                unlocks: {
                    textlines: [{dialogue: "village elder", lines: ["ask to leave 1"]}],
                },
            }),
            "dont remember": new Textline({
                name: "I don't remember how I got here, what happened?",
                text: `Some of our people found you unconscious in the forest, wounded and with nothing but pants and an old sword, so they brought you to our village. `
                + `It would seem you were on your way to a nearby town when someone attacked you and hit you really hard in the head.`,
                is_unlocked: false,
                locks_lines: ["what happened", "where am i", "dont remember"],
                unlocks: {
                    textlines: [{dialogue: "village elder", lines: ["ask to leave 1"]}],
                },
            }),
            "about": new Textline({
                name: "Who are you?",
                text: "I'm the unofficial leader of this village. If you have any questions, come to me",
                is_unlocked: false,
                locks_lines: ["about"]
            }),
            "ask to leave 1": new Textline({
                name: "Great... Thank you for help, but I think I should go there then. Maybe it will help me remember more.",
                text: "Nearby lands are dangerous and you are still too weak to leave. Do you plan on getting ambushed again?",
                is_unlocked: false,
                unlocks: {
                    textlines: [{dialogue: "village elder", lines: ["need to"]}],
                },
                locks_lines: ["ask to leave 1"],
            }),
            "need to": new Textline({
                name: "But I want to leave",
                text: `You first need to recover, to get some rest and maybe also training, as you seem rather frail... Well, you know what? Killing a few wolf rats could be a good exercise. `
                        +`You could help us clear some field of them, how about that?`,
                is_unlocked: false,
                unlocks: {
                    textlines: [{dialogue: "village elder", lines: ["rats", "ask to leave 2", "equipment"]}],
                    locations: ["Infested field"],
                    activities: [{location:"Village", activity:"weightlifting"}],
                },
                locks_lines: ["need to"],
            }),
            "equipment": new Textline({
                name: "Is there any way I could get a weapon and proper clothes?",
                text: `We don't have anything to spare, but you can talk with our trader. He should be somewhere nearby. `
                        +`If you need money, try selling him some rat remains. Fangs, tails or pelts, he will buy them all. I have no idea what he does with this stuff...`,
                is_unlocked: false,
                locks_lines: ["equipment"],
                unlocks: {
                    textlines: [{dialogue: "village elder", lines: ["money"]}],
                    traders: ["village trader"]
                }
            }),
            "money": new Textline({
                name: "Are there other ways to make money?",
                text: "You could help us with some fieldwork. I'm afraid it won't pay too well.",
                is_unlocked: false,
                locks_lines: ["money"],
                unlocks: {
                    activities: [{location: "Village", activity: "fieldwork"}],
                }
            }),
            "ask to leave 2": new Textline({
                name: "Can I leave the village?",
                text: "We talked about this, you are still too weak",
                is_unlocked: false,
            }),
            "rats": new Textline({
                name: "Are wolf rats a big issue?",
                text: `Oh yes, quite a big one. Not literally, no, though they are much larger than normal rats... `
                        +`They are a nasty vermin that's really hard to get rid of. And with their numbers they can be seriously life-threatening. `
                        +`Only in a group though, single wolf rat is not much of a threat`,
                is_unlocked: false,
            }),
            "cleared field": new Textline({ //will be unlocked on clearing infested field combat_zone
                name: "I cleared the field, just as you asked me to",
                text: `You did? That's good. How about a stronger target? Nearby cave is just full of this vermin. `
                        +`Before that, maybe get some sleep? Some folks prepared that shack over there for you. It's clean, it's dry, and it will give you some privacy. `
                        +`Oh, and before I forget, our old craftsman wanted to talk to you.`,
                is_unlocked: false,
                unlocks: {
                    locations: ["Nearby cave", "Infested field", "Shack"],
                    textlines: [{dialogue: "village elder", lines: ["ask to leave 3"]}],
                    dialogues: ["old craftsman"],
                },
                locks_lines: ["ask to leave 2", "cleared field"],
            }),
            "ask to leave 3": new Textline({
                name: "Can I leave the village?",
                text: "You still need to get stronger.",
                unlocks: {
                    locations: ["Nearby cave", "Infested field"],
                    dialogues: ["old craftsman"],
                },
                is_unlocked: false,
            }),
            "cleared cave": new Textline({
                name: "I cleared the cave. Most of it, at least",
                text: `Then I can't call you "too weak" anymore, can I? You are free to leave whenever you want, but still, be careful. You might also want to ask the guard for some tips about the outside. He used to be an adventurer.`,
                is_unlocked: false,
                unlocks: {
                    textlines: [{dialogue: "village elder", lines: ["ask to leave 4"]}],
                    locations: ["Forest road", "Infested field", "Nearby cave"],
                    dialogues: ["village guard"],
                },
                locks_lines: ["ask to leave 3", "rats", "cleared cave"],
            }),
            "ask to leave 4": new Textline({
                name: "Can I leave the village?",
                text: "You are strong enough, you can leave and come whenever you want.",
                is_unlocked: false,
                unlocks: {
                    locations: ["Forest road", "Infested field", "Nearby cave"],
                    dialogues: ["village guard", "old craftsman"],
                },
            }),
            "new tunnel": new Textline({
                name: "I found an even deeper tunnel in the cave",
                text: "The what?... I have a bad feeling about this, you better avoid it until you get better equipment. Don't forget to bring a good shield too.",
                is_unlocked: false,
                locks_lines: ["new tunnel"],
            }),
        }
    });

    dialogues["old craftsman"] = new Dialogue({
        name: "old craftsman",
        is_unlocked: false,
        textlines: {
            "hello": new Textline({
                name: "Hello, I heard you wanted to talk to me?",
                text: "Ahh, good to see you traveler. I just thought of a little something that could be of help for someone like you. See, young people this days "+
                "don't care about the good old art of crafting and prefer to buy everything from the store, but I have a feeling that you just might be different. "+
                "Would you like a quick lesson?",
                unlocks: {
                    textlines: [{dialogue: "old craftsman", lines: ["learn", "leave"]}],
                },
                locks_lines: ["hello"],
            }),
            "learn": new Textline({
                name: "Sure, I'm in no hurry.",
                text: "Ahh, that's great. Well then... \n*[Old man spends some time explaining all the important basics of crafting and providing you with tips]*\n"+
                "Ahh, and before I forget, here, take these. They will be helpful for gathering necessary materials.",
                unlocks: {
                    textlines: [{dialogue: "old craftsman", lines: ["remind1", "remind2", "remind3"]}],
                    items: ["Old pickaxe" ,"Old axe", "Old sickle"],
                    flags: ["is_gathering_unlocked", "is_crafting_unlocked"],
                },
                locks_lines: ["learn","leave"],
                is_unlocked: false,
            }),
            "leave": new Textline({
                name: "I'm not interested.",
                text: "Ahh, I see. Maybe some other time then, when you change your mind, hmm?",
                is_unlocked: false,
            }),
            
            "remind1": new Textline({
                name: "Could you remind me how to create equipment for myself?",
                text: "Ahh, of course. Unless you are talking about something simple like basic clothing, then you will first need to create components that can then be assembled together. "+
                "For weapons, you generally need a part that you use to hit an enemy and a part that you hold in your hand. For armor, you will need some actual armor and then something softer to wear underneath, "+
                "which would mostly mean some clothes.",
                is_unlocked: false,
            }),
            "remind2": new Textline({
                name: "Could you remind me how to improve my creations?",
                text: "Ahh, that's simple, you just need more experience. This alone will be a great boon to your efforts. For equipment, you might also want to start with better components. "+
                "After all, even with the most perfect assembling you can't turn a bent blade into a legendary sword.",
                is_unlocked: false,
            }),
            "remind3": new Textline({
                name: "Could you remind me how to get crafting materials?",
                text: "Ahh, there's multiple ways of that. You can gain them from fallen foes, you can gather them around, or you can even buy them if you have some spare coin.",
                is_unlocked: false,
            }),
        }
    });

    dialogues["village guard"] = new Dialogue({
        name: "village guard",
        is_unlocked: false,
        textlines: {
            "hello": new Textline({
                name: "Hello?",
                text: "Hello. I see you are finally leaving, huh?",
                unlocks: {
                    textlines: [{dialogue: "village guard", lines: ["tips", "job"]}],
                },
                locks_lines: ["hello"],
            }),
            "job": new Textline({
                name: "Do you maybe have any jobs for me?",
                is_unlocked: false,
                text: "You are somewhat combat capable now, so how about you help me and the boys on patrolling? Not much happens, but it pays better than working on fields",
                unlocks: {
                    activities: [{location:"Village", activity:"patrolling"}],
                },
                locks_lines: ["job"],
            }),
            "tips": new Textline({
                name: "Can you give me any tips for the journey?",
                is_unlocked: false,
                text: `First and foremost, don't rush. It's fine to spend some more time here, to better prepare yourself. `
                +`There's a lot of dangerous animals out there, much stronger than those damn rats, and in worst case you might even run into some bandits. `
                +`If you see something that is too dangerous to fight, try to run away.`,
                unlocks: {
                    textlines: [{dialogue: "village guard", lines: ["teach"]}],
                },
            }),
            "teach": new Textline({
                name: "Could you maybe teach me something that would be of use?",
                is_unlocked: false,
                text: `Lemme take a look... Yes, it looks like you know some basics. Do you know any proper techniques? No? I thought so. I could teach you the most standard three. `
                +`They might be more tiring than fighting the "normal" way, but if used in a proper situation, they will be a lot more effective. Two can be easily presented through `
                + `some sparring, so let's start with it. The third I'll just have to explain. How about that?`,
                unlocks: {
                    locations: ["Sparring with the village guard (quick)", "Sparring with the village guard (heavy)"],
                },
                locks_lines: ["teach"],
            }),
            "quick": new Textline({
                name: "So about the quick stance...",
                is_unlocked: false,
                text: `It's usually called "quick steps". As you have seen, it's about being quick on your feet. `
                +`While power of your attacks will suffer, it's very fast, making it perfect against more fragile enemies`,
                otherUnlocks: () => {
                    if(dialogues["village guard"].textlines["heavy"].is_finished) {
                        dialogues["village guard"].textlines["wide"].is_unlocked = true;
                    }
                },
                locks_lines: ["quick"],
                unlocks: {
                    stances: ["quick"]
                }
            }),
            "heavy": new Textline({
                name: "So about the heavy stance...",
                is_unlocked: false,
                text: `It's usually called "crushing force". As you have seen, it's about putting all your strength in attacks. ` 
                +`It will make your attacks noticeably slower, but it's a perfect solution if you face an enemy that's too tough for normal attacks`,
                otherUnlocks: () => {
                    if(dialogues["village guard"].textlines["quick"].is_finished) {
                        dialogues["village guard"].textlines["wide"].is_unlocked = true;
                    }
                },
                locks_lines: ["heavy"],
                unlocks: {
                    stances: ["heavy"]
                }
            }),
            "wide": new Textline({
                name: "What's the third technique?",
                is_unlocked: false,
                text: `It's usually called "broad arc". Instead of focusing on a single target, you make a wide swing to hit as many as possible. ` 
                +`It might work great against groups of weaker enemies, but it will also significantly reduce the power of your attacks and will be even more tiring than the other two stances.`,
                locks_lines: ["wide"],
                unlocks: {
                    stances: ["wide"]
                }
            }),
        }
    });

    dialogues["gate guard"] = new Dialogue({
        name: "gate guard",
        textlines: {
            "enter": new Textline({
                name: "Hello, can I get in?",
                text: "The town is currently closed to everyone who isn't a citizen or a guild member. No exceptions.",
            }), 
        }
    });
    dialogues["suspicious man"] = new Dialogue({
        name: "suspicious man",
        textlines: {
            "hello": new Textline({ 
                name: "Hello? Why are you looking at me like that?",
                text: "Y-you! You should be dead! *the man pulls out a dagger*",
                unlocks: {
                    locations: ["Fight off the assailant"],
                },
                locks_lines: ["hello"],
            }), 
            "defeated": new Textline({ 
                name: "What was that about?",
                is_unlocked: false,
                text: "I... We... It was my group that robbed you. I thought you came back from your grave for revenge... Please, I don't know anything. "
                +"If you want answers, ask my boss. He's somewhere in the town.",
                locks_lines: ["defeated"],
                unlocks: {
                    textlines: [{dialogue: "suspicious man", lines: ["behave"]}],
                },
            }), 
            "behave": new Textline({ 
                name: "Are you behaving yourself?",
                is_unlocked: false,
                text: "Y-yes! Please don't beat me again!",
                locks_lines: ["defeated"],
            }), 
        }
    });
    dialogues["farm supervisor"] = new Dialogue({
        name: "farm supervisor",
        textlines: {
            "hello": new Textline({ 
                name: "Hello",
                text: "Hello stranger",
                unlocks: {
                    textlines: [{dialogue: "farm supervisor", lines: ["things", "work", "animals", "fight", "fight0"]}],
                },
                locks_lines: ["hello"],
            }),
            "work": new Textline({
                name: "Do you have any work with decent pay?",
                is_unlocked: false,
                text: "We sure could use more hands. Feel free to help my boys on the fields whenever you have time!",
                unlocks: {
                    activities: [{location: "Town farms", activity: "fieldwork"}],
                },
                locks_lines: ["work"],
            }),
            "animals": new Textline({
                name: "Do you sell anything?",
                is_unlocked: false,
                text: "Sorry, I'm not allowed to. I could however let you take some stuff in exchange for physical work, and it just so happens our sheep need shearing.",
                required_flags: {yes: ["is_gathering_unlocked"]},
                unlocks: {
                    activities: [{location: "Town farms", activity: "animal care"}],
                },
                locks_lines: ["animals"],
            }),
            "fight0": new Textline({
                name: "Do you have any task that requires some good old violence?",
                is_unlocked: false,
                text: "I kinda do, but you don't seem strong enough for that. I'm sorry.",
                required_flags: {no: ["is_deep_forest_beaten"]},
            }),
            "fight": new Textline({
                name: "Do you have any task that requires some good old violence?",
                is_unlocked: false,
                text: "Actually yes. There's that annoying group of boars that keep destroying our fields. "
                + "They don't do enough damage to cause any serious problems, but I would certainly be calmer if someone took care of them. "
                + "Go to the forest and search for a clearing in north, that's where they usually roam when they aren't busy eating our crops."
                + "I can of course pay you for that, but keep in mind it won't be that much, I'm running on a strict budget here.",
                required_flags: {yes: ["is_deep_forest_beaten"]},
                unlocks: {
                    locations: ["Forest clearing"],
                },
                locks_lines: ["fight"],
            }),
            "things": new Textline({
                is_unlocked: false,
                name: "How are things around here?",
                text: "Nothing to complain about. Trouble is rare, pay is good, and the soil is as fertile as my wife!",
                unlocks: {
                    textlines: [{dialogue: "farm supervisor", lines: ["animals", "fight", "fight0"]}],
                }
            }), 
            "defeated boars": new Textline({
                is_unlocked: false,
                name: "I took care of those boars",
                text: "Really? That's great! Here, this is for you.",
                locks_lines: ["defeated boars"],
                unlocks: {
                    money: 1000,
                }
            }), 
        }

    });

    //NekoRPG dialogues below
    dialogues["猫妖"] = new Dialogue({
        name: "Cat Demon",
        textlines: {
            "你是谁": new Textline({
                name: "Who are you?",
                text: "This is Cat Demon! Now, let me give you a brief introduction to this place.",
                unlocks: {
                    textlines: [{dialogue: "猫妖", lines: ["背景故事"]}],
                },
                locks_lines: ["你是谁"],
            }),
            "背景故事": new Textline({
                is_unlocked: false,
                name: "Where is this place?",
                text: "In the beginning, a continent called Xuelo came into being.<br>The Xuelo Continent brims with energy, giving rise to countless races and forms of life.<br>On this continent, the strong can trample the weak underfoot without restraint!<br>And here — within the Xuelo Continent, the Siyong World, the Yangang Territory — is the Nayaka Clan.",


                unlocks: {
                    textlines: [{dialogue: "猫妖", lines: ["Neko是谁"]}],
                },

                locks_lines: ["背景故事"],
            }),
            "Neko是谁": new Textline({
                is_unlocked: false,
                name: "And who is Neko?",
                text: "Neko — an ordinary, unremarkable girl of the Nayaka Clan in Yangang City.<br>"+
                "One day, just as Neko finished her morning cultivation,<br>"+
                "she discovered that her elder sister Nanami, who had grown up alongside her, was nowhere to be found.<br>"+
                "Upon learning from the clan that Nanami had gone out to train the day before and had not yet returned, Neko could not spare a moment to think.<br>"+
                "She resolutely left the clan alone, setting out to find any trace of Nanami.<br>"+
                "And so our story begins...",

                unlocks: {

                    flags: ["is_gathering_unlocked", "is_crafting_unlocked"],
                    locations: ["纳家练兵场 - 1"],
                },

                locks_lines: ["Neko是谁"],
            }),
            "MT10_clear": new Textline({
                is_unlocked: false,
                name: "Open the Gate",
                text: "In [V0.13], this dialogue should theoretically never unlock.<br>" +
                "If you are loading an old save after an update, you may use this dialogue to unlock subsequent areas.<br>" +
                "MOD - NekoRPG author: Supernatural Creature Fire-Breathing Research Association - Sayuki (perpetually whimpering =w=)<br>" +
                "Original: Yet Another Idle RPG - miktaew <br>" +
                "Settings from: I Eat Tomatoes - Swallowed Star, Qianye - Neko's Story <br>",
                unlocks: {
                    locations: ["燕岗城"],
                },
                locks_lines: ["MT10_clear"],
            })
            // "what happened": new Textline({
            //     name: "My head hurts.. What happened?",
            //     text: `Some of our people found you unconscious in the forest, wounded and with nothing but pants and an old sword, so they brought you to our village. `
            //     + `It would seem you were on your way to a nearby town when someone attacked you and hit you really hard in the head.`,
            //     is_unlocked: false,
            //     locks_lines: ["what happened", "where am i", "dont remember"],
            //     unlocks: {
            //         textlines: [{dialogue: "village elder", lines: ["ask to leave 1"]}],
            //     },
            // }),
        }
    });
    dialogues["秘法石碑 - 1"] = new Dialogue({
        name: "Arcane Stele - 1",
        textlines: {
            "Speed": new Textline({
                is_unlocked: false,
                name: "Comprehend: Blood Fusion - Swift",
                text: "Blood Fusion - Swift has been added to available Arcane Arts!",
                locks_lines: ["Speed"],
                unlocks: {
                    stances: ["MB_Speed"],
                },
            }), 
            "Power": new Textline({
                is_unlocked: false,
                name: "Comprehend: Blood Fusion - Edge",
                text: "Blood Fusion - Edge has been added to available Arcane Arts!",

                locks_lines: ["Power"],
                unlocks: {
                    stances: ["MB_Power"],
                },
            }), 
        }
    });
    
    dialogues["路人甲"] = new Dialogue({
        name: "Passerby",
        textlines: {
            "shop": new Textline({ 
                is_unlocked: false,
                name: "Excuse me, is there a shop around here?",
                text: "Little girl, just left your clan, haven't you?<br>" +
                "Space is precious in central Yangang City — shops are mostly in the outer districts.<br>" +
                "The nearest one is the chain store \"Yangang General Store\"<br>"+"Walk another half mile to the east and you'll find it",

                unlocks: {
                    traders: ["Yangang General Store"],
                },
                locks_lines: ["shop"],
            }), 
        }
    });
    
    dialogues["百兰"] = new Dialogue({
        name: "Bailan",
        textlines: {
            "before": new Textline({ 
                is_unlocked: true,
                name: "Excuse me, who are you?",
                text: "Where did you come from, little girl? With your level of cultivation, going out to train all on your own —<br>are you sure that's a good idea? The Wild Beasts out there will eat you alive.",

                unlocks: {
                    textlines: [{dialogue: "百兰", lines: ["before2"]}],
                },
                locks_lines: ["before"],
            }),
            "before2": new Textline({ 
                is_unlocked: false,
                name: "Sir, it's not right to look down on people, you know.",
                text: "Hey, who are you calling 'sir'?! Don't push your luck——",

                unlocks: {
                    locations: ["燕岗近郊 - 0"],
                },
                locks_lines: ["before2"],
            }), 
            "defeat": new Textline({ 
                is_unlocked: false,
                name: "Wait, what's that you're holding in your hand?",
                text: "This... this is a map,<br>drawn to show the location of a recently discovered Treasure Site.",

                unlocks: {
                    textlines: [{dialogue: "百兰", lines: ["defeat2"]}],
                },
                locks_lines: ["defeat"],
            }), 
            "defeat2": new Textline({ 
                is_unlocked: false,
                name: "Is there more detailed information?",
                text: "Oh yes, yes — I've heard there are quite a few valuable things inside,<br>but it's rather dangerous. Very few people make it out alive.",

                unlocks: {
                    textlines: [{dialogue: "百兰", lines: ["defeat3"]}],
                },
                locks_lines: ["defeat2"],
            }), 
            "defeat3": new Textline({ 
                is_unlocked: false,
                name: "Hand it over, and you can go.",
                text: "......Fine.<br>(Ugh, to lose to a little girl like this —<br>my luck is truly awful. How am I going to explain this to the clan...)",

                unlocks: {
                    items: [{item_name:"地图-藏宝地"}],
                    //items: ["地图-藏宝地"],
                    locations: ["燕岗近郊 - 1"],
                },
                locks_lines: ["defeat3"],
            }),
            "V0.21 Recover": new Textline({ 
                is_unlocked: false,
                name: "V0.21 update: click here to unlock the next area if loading an old save",
                text: "Area 3-1 has been unlocked!",

                unlocks: {
                    locations: ["燕岗近郊 - 1"],
                },
                locks_lines: ["V0.21 Recover"],
            }),
        }
    });
    
    dialogues["地宫老人"] = new Dialogue({
        name: "Old Man of the Underground Palace",
        textlines: {
            "dig": new Textline({ 
                is_unlocked: true,
                name: "Hmm... old man, what is it you want to say?",
                text: "Sometimes, fighting monsters directly yields very little.<br>" +
                "But when you put your pickaxe to clever use,<br>" +
                "you may find surprising and unexpected results.<br>However, don't be too greedy...<br>The law of diminishing returns plays out perfectly here.",
                
                locks_lines: ["dig"],
            }),
        }
    });

    
    dialogues["纳娜米"] = new Dialogue({
        name: "Nanami",
        textlines: {
            "1": new Textline({ 
                is_unlocked: true,
                name: "Sister!",
                text: "Koko?!<br>Why are you here? It's dangerous here,<br>listen to me — stop fooling around and get back to the clan.",

                unlocks: {
                    textlines: [{dialogue: "纳娜米", lines: ["2"]}],
                },
                locks_lines: ["1"],
            }),
            "2": new Textline({ 
                is_unlocked: false,
                name: "No. A well-behaved child would never abandon their sister at a time like this.",
                text: "......It's my fault for not explaining clearly.<br>The truth is, this expedition was tacitly approved by Clan Head Nabu.<br>Or rather, it was he who deliberately arranged for me to come.",

                unlocks: {
                    textlines: [{dialogue: "纳娜米", lines: ["3"]}],
                },
                locks_lines: ["2"],
            }),
            "3": new Textline({ 
                is_unlocked: false,
                name: "Eh, wait, what?",
                text: "...To tell you the truth, during a Wild Beast hunt some time ago,<br>the clan was ambushed by unknown assailants and suffered heavy losses.<br>"+
                "The attackers were extraordinarily powerful —<br>with eerie movement techniques and speed,<br>they cut down our clansmen almost effortlessly.<br>"+
                "The Clan Head was furious and dispatched our finest elites to investigate,<br>ultimately discovering this underground palace housing a great treasure,<br>and let word spread!<br>"+
                "Now, Earth Rank cultivators from a thousand miles around<br>have been receiving the news and making their way here.<br>Yet the master of this underground palace has shown no sign of movement.",

                unlocks: {
                    textlines: [{dialogue: "纳娜米", lines: ["4"]}],
                },
                locks_lines: ["3"],
            }),
            "4": new Textline({ 
                is_unlocked: false,
                name: "So that's how it is? A bit frightening. But then, Sister, why would you...",
                text: "Well......this enemy is extremely cunning.<br>If the clan were to rashly send out Sky Rank cultivators,<br>it would only put them on guard.<br>"+
                "That's why they quietly sent someone unassuming like me,<br>disguised as a reckless ordinary adventurer.<br>And I have in my hands a trump card capable of eliminating the enemy.<br>"+
                "But there are simply too many Wild Beasts down here.<br>I can handle a few at most,<br>and I can't reveal that trump card — so I got trapped.",

                unlocks: {
                    textlines: [{dialogue: "纳娜米", lines: ["5"]}],
                },
                locks_lines: ["4"],
            }),
            "5": new Textline({ 
                is_unlocked: false,
                name: "Leave it to me, Sister. We'll take them all out together!",
                text: "No no, it's too dangerous.<br>......Wait, Koko, how did you get down here?<br>Don't tell me you already dealt with that Wild Beast elite upstairs?<br>",

                unlocks: {
                    textlines: [{dialogue: "纳娜米", lines: ["6"]}],
                },
                locks_lines: ["5"],
            }),
            "6": new Textline({ 
                is_unlocked: false,
                name: "I've told you before, don't underestimate me. Besides, if I can't even help my sister with something this small, what good am I?",
                text: "......<br>I see... without realizing it, you've grown up, haven't you......<br>Alright, I understand.",

                unlocks: {
                    items: [{item_name: "纳娜米"}],
                },
                locks_lines: ["6"],
            }),
        }
    });
    
    dialogues["纳布"] = new Dialogue({
        name: "Nabu",
        textlines: {
            "1": new Textline({ 
                is_unlocked: true,
                name: "Father, Sister.",
                text: "[Nabu] You're both here. Koko, Nana — good work this time.<br>[Nanami] Koko, we really made a great contribution this time!<br>The City Lord's Mansion gave us so many rewards.",

                unlocks: {
                    textlines: [{dialogue: "纳布", lines: ["2"]}],
                },
                locks_lines: ["1"],
            }),
            "2": new Textline({ 
                is_unlocked: false,
                name: "Yes... far more generous than I had imagined.",
                text: "[Nabu] Koko, is something weighing on your mind?<br>[Nanami] Senior Clan Head, Koko will say what she wants to say when she's ready.<br>Please don't press her......<br>[Nabu] Very well. After all, our little girl is eleven years old now.<br>How does it feel? Are you close to breaking through to Earth Rank?",

                unlocks: {
                    textlines: [{dialogue: "纳布", lines: ["3"]}],
                },
                locks_lines: ["2"],
            }),
            "3": new Textline({ 
                is_unlocked: false,
                name: "Yes... ever since the underground palace trip, I've felt a great deal — and I've faintly touched that threshold.",
                text: "There are two ways to reach Earth Rank.<br>The first is to slowly accumulate comprehension until it naturally comes together.<br>The second — to break through swiftly through real-world tempering.",

                unlocks: {
                    textlines: [{dialogue: "纳布", lines: ["4"]}],
                },
                locks_lines: ["3"],
            }),
            "4": new Textline({ 
                is_unlocked: false,
                name: "...I don't want to wait any longer. Father, Sister — I want to go to the Wild Beast Forest and seek an opportunity to break through.",
                text: "[Nanami] Koko......<br>[Nabu] The Wild Beast Forest is extremely perilous,<br>but you have the heart of an adventurer — your father will surely support you.<br>"+
                "The sword and armor you cobbled together from scraps at the training grounds<br>are yours from this day forward.<br>"+
                "And here is a protective talisman inscribed with a teleportation formation.<br>Use it if you find yourself in danger.<br>"+
                "[Nanami] Senior Clan Head, the Wild Beast Forest is far too dangerous —<br>could you give Koko the laser rifle I used before?<br>"+
                "No. While that would make things easier for Koko,<br>it would also remove the pressure needed for a true breakthrough.<br>",

                unlocks: {
                    textlines: [{dialogue: "纳布", lines: ["5"]}],
                },
                locks_lines: ["4"],
            }),
            "5": new Textline({ 
                is_unlocked: false,
                name: "Father, what is a laser rifle?",
                text: "It is time to tell you these things.<br>They relate to a legend —<br>" +
                `<span style="color:lightblue">The legend of the [Extraterrestrial Clan].</span><br>Once you break through to Earth Rank, Koko, I will tell you more.`,

                unlocks: {
                    textlines: [{dialogue: "纳布", lines: ["6"]}],
                },
                locks_lines: ["5"],
            }),
            "6": new Textline({ 
                is_unlocked: false,
                name: "I see... I understand. Then wait for good news from me.",
                text: "Hmph, always giving your sister worry.<br>You'd better do your best, little girl.<br>......Just like before — make sure you come back safe and sound.",

                unlocks: {
                    //items: [{item_name: "纳娜米"}],
                    locations: ["荒兽森林"],
                },
                locks_lines: ["6"],
            }),
        }
    });
    
    dialogues["清野瀑布"] = new Dialogue({
        name: "Qingye Waterfall",
        starting_text: "Gazing at Qingye Waterfall",
        textlines: {
            "wf1": new Textline({
                is_unlocked: false,
                name: "...",
                text: "Father always said the outside world is dangerous and cruel.<br>......But I don't believe it. I want to see further places for myself.",
                locks_lines: ["wf1"],
                unlocks: {
                    textlines: [{dialogue: "清野瀑布", lines: ["wf2"]}],
                },
            }), 
            "wf2": new Textline({
                is_unlocked: false,
                name: "...",
                text: "Now I've truly experienced a brush with death,<br>and I understand what Father meant.",
                locks_lines: ["wf2"],
                unlocks: {
                    spec:"DeathCount-1",
                    textlines: [{dialogue: "清野瀑布", lines: ["wf3"]}],
                },
            }), 
            "wf3": new Textline({
                is_unlocked: false,
                name: "...",
                text: "Perhaps, when the day comes that I truly become a strong cultivator,<br>this wish might be fulfilled.",
                locks_lines: ["wf3"],
                unlocks: {
                    textlines: [{dialogue: "清野瀑布", lines: ["wf4"]}],
                },
            }), 
            "wf4": new Textline({
                is_unlocked: false,
                name: "Beyond the waterfall are mountains — what lies beyond the mountains?",
                text: "[Strange Voice] What are you afraid of?<br>You must become strong! Go explore the world beyond!<br>The trials of life and death — what doesn't kill you only sends you back to bed when you fail!",
                locks_lines: ["wf4"],
                unlocks: {
                    textlines: [{dialogue: "清野瀑布", lines: ["wf5"]}],
                },
            }), 
            "wf5": new Textline({
                is_unlocked: false,
                name: "*Swings sword instinctively*",
                text: "The body gradually becomes more agile and nimble.<br>All the accumulation of these days —<br>finally ignited in this very moment!",
                locks_lines: ["wf5"],
                unlocks: {
                    textlines: [{dialogue: "清野瀑布", lines: ["wf6"]}],
                },
            }), 
            "wf6": new Textline({
                is_unlocked: false,
                name: "......What just happened? What did I just do?",
                text: "Heartless Water - Flood, Heartless Water - Stream, Heartless Water - Rain have been added to available Arcane Arts!",

                locks_lines: ["wf6"],
                unlocks: {
                    stances: ["WH_Power","WH_Speed","WH_Multi"],
                },
            }), 
        }
    });
    dialogues["纳布(江畔)"] = new Dialogue({
        name: "Nabu (Riverside)",
        starting_text: "Talk to father Nabu",
        textlines: {
            "jp1": new Textline({ 
                is_unlocked: false,
                name: "...",
                text: "Koko! Are you alright? What happened to you, all those injuries?",
                unlocks: {
                    textlines: [{dialogue: "纳布(江畔)", lines: ["jp2"]}],
                },
                
                locks_lines: ["jp1"],
            }),
            "jp2": new Textline({ 
                is_unlocked: false,
                name: "It's a long story... I got into a fight with people from the Bai Clan outside. Good thing I had that talisman.",
                text: "Neko told Nabu everything that had happened,<br>including the unexpected gain she had<br>while meditating on Qingye Waterfall after being injured.<br><br>[Nabu] How outrageous — those Bai Clan bastards! They deserve everything coming to them!<br>All they did was get jealous of what our clan obtained, and stoop to such underhanded tactics.<br>That Bailan isn't even Earth Rank,<br>has no real standing in the Bai Clan at all — saying they're helping him save face is just a shameful excuse!",
                unlocks: {
                    textlines: [{dialogue: "纳布(江畔)", lines: ["jp3"]}],
                },
                
                locks_lines: ["jp2"],
            }),
            "jp3": new Textline({ 
                is_unlocked: false,
                name: "This matter... I bear some responsibility too. I shouldn't have provoked the powerful Bai Clan and brought trouble to the family.",
                text: "Koko, this is not your fault.<br>Don't go out alone for a while — I'll send someone to protect you. [Neko] I'm fine. Father, you always said that opportunity only comes in dangerous places.",
                unlocks: {
                    textlines: [{dialogue: "纳布(江畔)", lines: ["jp4"]}],
                },
                
                locks_lines: ["jp3"],
            }),
            "jp4": new Textline({ 
                is_unlocked: false,
                name: "It is precisely because of this life-and-death crisis that I have the strength I have now.",
                text: "",
                unlocks: {
                    spec:"Realm-A3",
                    textlines: [{dialogue: "纳布(江畔)", lines: ["jp5"]}],
                },
                
                locks_lines: ["jp4"],
            }),
            "jp5": new Textline({ 
                is_unlocked: false,
                name: "(Setting for the Extraterrestrial Clan abridged) What a fascinating world —",
                text: "......It is also time to send you into the clan's Secret Realm for tempering. Know that the requirement to enter the Nayaka Secret Realm is reaching the mid-stage of Earth Rank.",
                unlocks: {
                    textlines: [{dialogue: "纳布(江畔)", lines: ["jp6"]}],
                },
                
                locks_lines: ["jp5"],
            }),
            "jp6": new Textline({ 
                is_unlocked: false,
                name: "Oh, the clan's Secret Realm?",
                text: "",
                unlocks: {
                    spec:"Realm-A4",
                    locations: ["纳家秘境"],
                },
                
                locks_lines: ["jp6"],
            }),
        }
    });
    dialogues["秘境心火精灵"] = new Dialogue({
        name: "Secret Realm Heart-Fire Spirit",
        textlines: {
            "xh1": new Textline({ 
                is_unlocked: false,
                name: "Hmph~ Now you know how fearsome I am!",
                text: "Spare me, spare me——<br>This one is just a 'Spirit' born from the Secret Realm,<br>with absolutely no wealth or resources...",
                unlocks: {
                    textlines: [{dialogue: "秘境心火精灵", lines: ["xh2"]}],
                },
                
                locks_lines: ["xh1"],
            }),
            "xh2": new Textline({ 
                is_unlocked: false,
                name: "Hey, in a core area like this, you must have some authority over the Secret Realm, right?",
                text: "Ah yes, yes indeed!<br>I can help you adjust the Secret Realm's Spirit Formation Power!<br>That way you can gain more battle comprehension!",
                unlocks: {
                    textlines: [{dialogue: "秘境心火精灵", lines: ["check"]},{dialogue: "秘境心火精灵", lines: ["powerup"]},{dialogue: "秘境心火精灵", lines: ["powerdown"]},{dialogue: "秘境心火精灵", lines: ["powermax"]}],
                    locations: ["纳家秘境 - ∞"],
                },
                
                locks_lines: ["xh2"],
            }),
            "check": new Textline({ 
                is_unlocked: false,
                name: "How much Spirit Formation Power is currently active?",
                text: "",
                unlocks: {
                    textlines:[{dialogue: "秘境心火精灵", lines: ["powermax"]}],
                    spec: "A6-check"
                },
            }),
            "powerup": new Textline({ 
                is_unlocked: false,
                name: "Increase Spirit Formation Power by one level \\o/",
                text: "",
                unlocks: {
                    spec: "A6-up"
                },
            }),
            "powerdown": new Textline({ 
                is_unlocked: false,
                name: "Decrease Spirit Formation Power by one level T_T",
                text: "",
                unlocks: {
                    spec: "A6-down"
                },
            }),
            "powermax": new Textline({ 
                is_unlocked: false,
                name: "Raise Spirit Formation Power to the current maximum (ノ▼Д▼)ノ",
                text: "",
                unlocks: {
                    spec: "A6-max"
                },
            }),
        }
    });
    dialogues["纳鹰"] = new Dialogue({
        name: "Naying",
        starting_text: "Speak with the mysterious cultivator of the Barrier Lake",
        textlines: {
            "nb1": new Textline({ 
                is_unlocked: true,
                name: "......Senior, may I ask who you are?",
                text: "Heh heh, you don't recognize me?<br>True enough — it has been several thousand years since my fall.<br>Back in those days, I followed the Lord of Yangang City into battle,<br>and founded the Nayaka Clan within Yangang City.<br>I never imagined the clan would come this far.",
                unlocks: {
                    textlines: [{dialogue: "纳鹰", lines: ["nb2"]}],
                },
                
                locks_lines: ["nb1"],
            }),
            "nb2": new Textline({ 
                is_unlocked: false,
                name: "......You are the ancestor of the Nayaka Clan! This... how is it possible — the Elders and Father both said you were...",
                text: "No need to be surprised — I am indeed the ancestor of the Nayaka Clan, known as Naying.<br>None of the Nayaka descendants today know of this consciousness of mine,<br>hidden within the Secret Realm.<br>Were it to become known, I fear this Secret Realm<br>would be turned upside down by those adventurers.<br>",
                unlocks: {
                    textlines: [{dialogue: "纳鹰", lines: ["nb3"]}],
                },
                
                locks_lines: ["nb2"],
            }),
            "nb3": new Textline({ 
                is_unlocked: false,
                name: "How did this come to be? What happened back then that led to this state?",
                text: "Heh heh, little girl, no need to rush.<br>It is nothing more than a dull old tale.<br>In those days, I took a great risk to gather materials for a transaction,<br>venturing deep into the perilous Demon Blood Sea<br>to hunt powerful Wild Beasts.<br>In the Demon Blood Sea, I unwittingly fell into a trap<br>and became the soul slave of a <span style='color:pink'>Domain Rank</span> cultivator.<br>That cultivator... was likely comparable in power to the Lord of Yangang City.<br>",
                unlocks: {
                    textlines: [{dialogue: "纳鹰", lines: ["nb4"]}],
                },
                
                locks_lines: ["nb3"],
            }),
            "nb4": new Textline({ 
                is_unlocked: false,
                name: "...",
                text: "Such powerful cultivators forge soul slaves<br>for nothing more than to gain a powerful 'cannon fodder'.<br>At the time, I had absolutely no means of escape.<br>Those soul slaves obey their masters for life, without freedom,<br>with death ready to descend upon them at any moment.<br>Most met miserable ends after enduring endless dangers day and night!<br>To break free from this fate, I chose to destroy my own soul!<br>And transferred my consciousness into this single thread of thought.<br>This thread of thought had originally been stored within the clan's Secret Realm<br>to maintain communication with the clan — now it served a greater purpose.",
                unlocks: {
                    textlines: [{dialogue: "纳鹰", lines: ["nb5"]}],
                },
                
                locks_lines: ["nb4"],
            }),
            "nb5": new Textline({ 
                is_unlocked: false,
                name: "Ah...",
                text: "",
                unlocks: {
                    textlines: [{dialogue: "纳鹰", lines: ["nb6"]}],
                    spec: "A7-begin",
                },
                
                locks_lines: ["nb5"],
            }),
            "nb6": new Textline({ 
                is_unlocked: false,
                name: "I... can I?<br>Anything I can help with, Senior — please don't hesitate to ask.",
                text: "Your Fire Element comprehension has made some progress,<br>but there is still much room to grow.<br>That Domain Rank cultivator<br>was able to expand a [Domain] infused with law comprehension against his enemies —<br>I witnessed him use it several times.<br>Over thousands of years, I have developed my own understanding of this Domain.<br>Now I will impart my comprehension of these Arcane Arts<br>to you. Listen carefully.<br>",
                unlocks: {
                    textlines: [{dialogue: "纳鹰", lines: ["nb7"]}],
                },
                
                locks_lines: ["nb6"],
            }),
            "nb7": new Textline({ 
                is_unlocked: false,
                name: "Yes, this junior obeys.",
                text: "Naying extended a finger and pressed it between Neko's brows.<br>Instantly, a flood of complex information poured into her mind,<br>immersing her in all manner of profound states of comprehension.<br>After a moment, Neko opened her eyes,<br>with excitement gleaming at the depths of her gaze.<br>She could feel how greatly these insights would benefit her.<br>  [Neko] Senior, thank you.<br>I now have a clear understanding of the path ahead.<br>[Naying] No need for thanks.<br>I believe my legacy is nearly at its end here.<br>What you must do next is work hard to improve yourself —<br>and when I awaken once more, I hope to see you reach even greater heights.<br>",
                unlocks: {
                    textlines: [{dialogue: "纳鹰", lines: ["nb8"]}],
                    spec: "A7-exp",
                },
                
                locks_lines: ["nb7"],
            }),
            "nb8": new Textline({ 
                is_unlocked: false,
                name: "Senior... are you going to sleep again?",
                text: "  Heh heh, a single thread of thought cannot sustain itself indefinitely.<br>The next time, who knows when I shall wake.<br>If you wish to test yourself —<br>go to the depths of this Barrier Lake.<br>There, some 'Spirits' have naturally grown within the barrier,<br>developed consciousness, and seek to resist and break free.<br>For the stability of the Secret Realm, I entrust this task to you.<br>Go now — I won't keep you.",
                unlocks: {
                    locations: ["结界湖 - 1"],
                },
                
                locks_lines: ["nb8"],
            }),
        }
    });
    
    dialogues["纳娜米(废墟)"] = new Dialogue({
        name: "Nanami (Ruins)",
        textlines: {
            "fx1": new Textline({ 
                is_unlocked: true,
                name: "Sister, this vast expanse of ruins... is this where Shenlv City once stood?",
                text: "Yes. It is said that the Sky-Outsider<br>controlled a massive flying craft —<br>a palace-class treasure known as a 'D9-class Vessel'.<br>That craft reduced the entire city to rubble,<br>inflicting devastating casualties on our side of the Xuelo Continent.<br>In the end — through the combined assault of several hundred City Lord-level cultivators,<br>and even the intervention of a Heaven-Reaching existence,<br>they finally brought that craft down!",
                unlocks: {
                    textlines: [{dialogue: "纳娜米(废墟)", lines: ["fx2"]}],
                },
                
                locks_lines: ["fx1"],
            }),
            "fx2": new Textline({ 
                is_unlocked: false,
                name: "......Several hundred City Lord-level cultivators! Have the powerful fighters from over a dozen nearby territories already gathered here?",
                text: "More than half of them, at least.<br>But when the cultivators stormed inside the D9-class Vessel,<br>they found the Sky-Outsider wasn't in it at all.<br>We had underestimated him —<br>he had long since quietly launched over a hundred small craft,<br>known as 'B9-class Vessels', in an attempt to flee.",
                unlocks: {
                    textlines: [{dialogue: "纳娜米(废墟)", lines: ["fx3"]}],
                },
                
                locks_lines: ["fx2"],
            }),
            "fx3": new Textline({ 
                is_unlocked: false,
                name: "D9, B9. It feels like some kind of classification system — I wonder what it is...",
                text: "Who knows.<br>True, these small craft were made of only precious-grade materials,<br>but they were small and fast — for a time no one could track them.<br>It took that great figure personally intervening;<br>within his soul-detection range,<br>nothing could hide.<br>In the end, the cultivators intercepted the vessel he was riding<br>beneath the eighteenth cloud layer,<br>and destroyed every last one of the vessels.",
                unlocks: {
                    textlines: [{dialogue: "纳娜米(废墟)", lines: ["fx4"]}],
                },
                
                locks_lines: ["fx3"],
            }),
            "fx4": new Textline({ 
                is_unlocked: false,
                name: "Whew... quite a story. Our goal is to find those crashed 'Vessels' and search for the treasures we need, right?",
                text: "Exactly. The treasures within the main battle Vessel<br>are currently being fought over by Sky-Nimbus Rank and above cultivators.<br>Our target, however, is those smaller vessels.<br>But — there is one more target,<br>Koko, right before your eyes.<br>The ruins of Shenlv City.",
                unlocks: {
                    textlines: [{dialogue: "纳娜米(废墟)", lines: ["fx5"]}],
                },
                
                locks_lines: ["fx4"],
            }),
            "fx5": new Textline({ 
                is_unlocked: false,
                name: "The ruins of... Shenlv City?",
                text: "Yes, that's right. The once-flourishing Shenlv City,<br>now in ruins, with many of its original inhabitants gone,<br>has left behind many things. The Clan Head has already issued orders<br>for the entire Nayaka Clan to split up and search.<br>After finding useful valuables and treasures——",
                unlocks: {
                    textlines: [{dialogue: "纳娜米(废墟)", lines: ["fx6"]}],
                },
                
                locks_lines: ["fx5"],
            }),
            "fx6": new Textline({ 
                is_unlocked: false,
                name: "Wait, Sister — this kind of thing... it doesn't feel right. Won't the people of this city be unable to rest in peace?",
                text: "Koko, all your sister knows is<br>that anything that helps the Nayaka Clan grow faster<br>is worth doing.<br>Right now, every power great and small in the surrounding cities is doing the same thing.<br>It is not easy for us to claim more than others,<br>and there is no time to grieve for those refugees.",
                unlocks: {
                    textlines: [{dialogue: "纳娜米(废墟)", lines: ["fx7"]}],
                },
                
                locks_lines: ["fx6"],
            }),
            "fx7": new Textline({ 
                is_unlocked: false,
                name: "......I, I will listen to you, Sister.",
                text: "(If the same thing were to happen to Yangang City, would everyone... treat us the same way?)",
                unlocks: {
                    textlines: [{dialogue: "声律城难民", lines: ["fx8"]}],
                    
                    locations: ["声律城废墟 - 1"],
                },
                
                locks_lines: ["fx7"],
            }),
        }
    });
    dialogues["声律城难民"] = new Dialogue({
        name: "Shenlv City Refugee",
        textlines: {
            "fx8": new Textline({ 
                is_unlocked: false,
                name: "......Are you thirsty? Let me go find you some water.",
                text: "Thank you, little girl, but there's no need.<br>Thanks to this disaster, I no longer have to repay my debts to the City Lord's Mansion.<br>In a little while, I'll head back into the city —<br>the Sky Rank and Sky-Nimbus Rank fortunes left behind in there<br>are quite considerable.<br>Even just a portion of one powerful cultivator's belongings<br>would be enough to keep me comfortable for the rest of my life, hahaha——",
                unlocks: {
                    textlines: [{dialogue: "声律城难民", lines: ["fx9"]}],
                },
                
                locks_lines: ["fx8"],
            }),
            "fx9": new Textline({ 
                is_unlocked: false,
                name: "......S-sorry to bother you.",
                text: "(Come to think of it... when I get back to Yangang City,<br>should I ask the City Lord's Mansion for a<span class='coin coin_moneyT'>10B, 8B</span> loan?)<br>If the same thing were to happen to Yangang City,<br>at least there would be resources to start over with.",
                unlocks: {
                },
                
                locks_lines: ["fx9"],
            }),
        }
    });
    
    dialogues["心魔(战场)"] = new Dialogue({
        name: "Inner Demon (Battlefield)",
        starting_text: "Stop and steady your mind",
        textlines: {
            "zc1": new Textline({ 
                is_unlocked: true,
                name: "The sharp stench of blood hits you the moment you leave the city... it's suffocating.",
                text: "Just this one Sky-Outsider<br>has caused the fall of so many powerful cultivators.<br>I must stay clear-headed — I cannot engage in needless killing.<br>Otherwise... I will only drift further and further down that path.<br>",
                unlocks: {
                    textlines: [{dialogue: "心魔(战场)", lines: ["zc2"]}],
                    locations: ["声律城战场 - 1"],
                },
                
                locks_lines: ["zc1"],
            }),
            "zc2": new Textline({ 
                is_unlocked: false,
                name: "......(Review past experiences)",
                text: "",
                unlocks: {
                    spec: "A8-killcount",
                },
            }),
        }
    });
    
    dialogues["御兰"] = new Dialogue({
        name: "Yulan",
        starting_text: "Watch the battle between Yulan and Haohuang",
        textlines: {
            "yl1": new Textline({ 
                is_unlocked: false,
                name: "...",
                text: "[Haohuang] Yulan! You again —<br>this Vessel was discovered first by our people of Shenghuan City,<br>and yet your Lanling City insists on shamelessly contesting it?",
                unlocks: {
                    textlines: [{dialogue: "御兰", lines: ["yl2"]}],
                },
                
                locks_lines: ["yl1"],
            }), 
            "yl2": new Textline({ 
                is_unlocked: false,
                name: "(A Vessel! There's news about a Vessel?)",
                text: "[Yulan] What are you saying, General Hao?<br>This time, it was your Shenghuan City's forces who provoked us first —<br>Lanling City was merely acting in self-defense.<br>[Haohuang] Since you are so utterly unreasonable, I have no need to waste more words on you!<br>With just your handful of people, you think you can break our Huo Formation?<br>What a ridiculous fantasy!",
                unlocks: {
                    textlines: [{dialogue: "御兰", lines: ["yl3"]}],
                },
                
                locks_lines: ["yl2"],
            }),
            "yl3": new Textline({ 
                is_unlocked: false,
                name: "Oh, have they already clashed? What an exciting battle!",
                text: "(Intense greatsword effects)<br>(Intense lightning strike effects)<br><br>[Neko] Whew... even from this distance,<br>I can clearly feel the terrifying energy shockwaves.",
                unlocks: {
                    textlines: [{dialogue: "御兰", lines: ["yl4"]}],
                },
                
                locks_lines: ["yl3"],
            }),
            "yl4": new Textline({ 
                is_unlocked: false,
                name: "...",
                text: "But more than fearful,<br>being able to witness such powerful and refined Arcane Arts being unleashed with my own eyes —<br>it is truly exciting.<br>I can feel it — some of those insights deep in my mind<br>have already begun to become my own.",
                unlocks: {
                    flags: ["is_realm_enabled"],
                },
                
                locks_lines: ["yl4"],
            }),
        }
    });
    
    dialogues["皎月神像"] = new Dialogue({
        name: "Moonlight Idol",
        starting_text: "Pay respects to the Moonlight Idol on the battlefield",
        textlines: {
            "jy1": new Textline({ 
                is_unlocked: false,
                name: "(Bow respectfully three times)",
                text: "[Moonlight Projection]<br>(This is an automated response)<br>What era do you think this is? Drop the old formalities —<br>just offer some Dao Coins as tribute.<br>In return, you shall receive the Moonlight Blessing...<br><br>By the way, the greater your vitality, the greater the blessing cost,<br>so you'll need to pay more.<br>Cultivators above <span class='realm_sky'>Sky Rank 4th Stage</span> need not apply —<br>this small idol cannot bear a projection of too powerful a force.",
                unlocks: {
                    textlines: [{dialogue: "皎月神像", lines: ["jy2"]},{dialogue: "皎月神像", lines: ["jy3"]}],
                },
                
                locks_lines: ["jy1"],
            }), 
            "jy2": new Textline({ 
                is_unlocked: false,
                name: "(Check current blessing and cost information)",
                text: "",
                unlocks: {
                    spec: "JY-check",
                },
            }), 
            "jy3": new Textline({ 
                is_unlocked: false,
                name: "(Offer Dao Coins to receive the blessing)",
                text: "",
                unlocks: {
                    spec: "JY-sacrifice",
                },
            }), 
        }
    });


    
    dialogues["纳娜米(飞船)"] = new Dialogue({
        name: "Nanami (Vessel)",
        textlines: {
            "nnm1": new Textline({ 
                is_unlocked: false,
                name: "Sister! What are you doing here?",
                text: "[Neko] ......Sister? *poke*<br>Neko tilted her head —<br>her sister didn't seem to respond at all,<br>currently absorbed in reading a book in her hands.<br>[Neko] The spine reads... 'Gene Primal Energy Application - Spirit Body Arts'?<br>It seems like she is completely immersed in this book,<br>as if on the verge of an epiphany — best not to disturb her......",

                unlocks: {
                    textlines: [{dialogue: "纳娜米(飞船)", lines: ["nnm2"]}],
                },
                locks_lines: ["nnm1"],
            }),
            "nnm2": new Textline({ 
                is_unlocked: false,
                name: "Neko quietly waited by her side, and in the blink of an eye three hours had passed.",
                text: "[Nanami] Ah, I see — no wonder!<br>This book is so detailed; to gain so much in such a short time,<br>simply wonderful!<br>She tossed the book aside,<br>stood up, stretched with a lazy yawn,<br>and glanced over — Neko was staring at her with a look of profound grievance.<br>[Nanami/Neko] WAAAAAH!!",

                unlocks: {
                    textlines: [{dialogue: "纳娜米(飞船)", lines: ["nnm3"]}],
                },
                locks_lines: ["nnm2"],
            }),
            "nnm3": new Textline({ 
                is_unlocked: false,
                name: "What are you doing, Sister! Why did you suddenly make that sound!",
                text: "[Nanami] K-Koko, when, when did you get here?<br>I thought those iron-skinned monsters had come......<br>[Neko] Hmm, about three hours — no matter how much I called, Sister wouldn't respond.<br>[Nanami] Boo hoo, it's all my fault for worrying you. That cultivation book just now seemed to have a pull to it — I got absorbed in it without even noticing.",

                unlocks: {
                    textlines: [{dialogue: "纳娜米(飞船)", lines: ["nnm4"]}],
                },
                locks_lines: ["nnm3"],
            }),
            "nnm3": new Textline({ 
                is_unlocked: false,
                name: "But Sister, a Spirit Body value of 200 million gets fully negated if the enemy has 2 million Agility — and all the enemies here have over 2 million Agility...",
                text: "[Nanami] Huh, Koko, what did you just say?<br>[Neko] From what I know about this game,<br>as long as you don't learn the Restraint arts, it can't hurt.<br>[Nanami] ......Is that really how it works now?!<br>The two exchanged their gains from this vessel expedition,<br>along with everything they had seen and heard along the way.<br>[Nanami] Much of the intelligence I found came from the books on this bookshelf.<br>They seem to contain quite a bit of information about the Extraterrestrial Clan,<br>but unfortunately the more core content is not mentioned at all.",

                unlocks: {
                    textlines: [{dialogue: "纳娜米(飞船)", lines: ["nnm4"]}],
                },
                locks_lines: ["nnm3"],
            }),
            "nnm4": new Textline({ 
                is_unlocked: false,
                name: "Sister, you said these puppets are called 'Techno-Constructs' by the Extraterrestrial Clan? And the ones we encountered along the way, many of them are 'A9' and 'B1' grade?",
                text: "[Nanami] Yes, if the records in these books are accurate,<br>the three grades A, B, and C correspond to Earth, Sky, and Sky-Nimbus Rank,<br>and the numbers that follow correspond to minor cultivation stages in order.<br>[Neko] So 'A9' grade is the ninth stage of Earth Rank?<br>But the ones I encountered along the way, like that blue-skinned creature...<br>they must be equivalent to early Sky Rank combat power.<br>[Nanami] One can only conclude... the Extraterrestrial Clan's classification is far stricter.<br>More than half a rank above the Xuelo World standard.<br>Koko, you've become so strong.<br>Without my laser rifle, the me of today<br>would be completely helpless against those Techno-Constructs.",

                unlocks: {
                    textlines: [{dialogue: "纳娜米(飞船)", lines: ["nnm5"]}],
                },
                locks_lines: ["nnm4"],
            }),
            "nnm5": new Textline({ 
                is_unlocked: false,
                name: "I suppose so, heh heh. So Sister, what do we do now?",
                text: "[Nanami] We've already come this far, so naturally we press on.<br>A vessel from the Sky-Outsiders...<br>who knows how many years until we see one again.<br>Even setting aside all the potentially precious treasures, I want to try out the new insights I've learned.<br>[Neko] That's really not that useful...<br>Sister, why not take a Moonlight Blessing during the new moon<br>and then drink this Returning Wind Potion?<br>I guarantee it can more than double your damage output!<br>With your HP, you can receive the blessing for just sixteen Dao Coins!<br><br>[Nanami] Hm... forget it,<br>we're already inside the vessel —<br>we can't exactly run all the way out to find the idol..",

                unlocks: {
                    items: [{item_name: "纳娜米(飞船)",quality:130}],
                },
                locks_lines: ["nnm5"],
            }),
        }
    });
    
    dialogues["核心反应堆"] = new Dialogue({
        name: "Core Reactor",
        starting_text: "Use [Core Reactor]",
        textlines: {
            "reactor": new Textline({ 
                is_unlocked: true,
                name: "Use [Core Reactor]",
                text: "...",
                unlocks: {
                    spec:"A7-reactor",
                },
            }),
        }
    });

    dialogues["纳布(沼泽)"] = new Dialogue({
        name: "Nabu (Swamp)",
        textlines: {
            "zz1": new Textline({ 
                is_unlocked: true,
                name: "...",
                text: "No one could have anticipated<br>that the radiation from the Sky-Outsider vessel's crash<br>would cause so many Wild Beasts to mutate.<br>Perhaps this is the outsider's final act of revenge...<br>These Wild Beasts have become stronger and more ferocious than before.<br>A vast number of Sky Rank and even Sky-Nimbus Rank Wild Beasts have emerged — a Beast Tide has formed.",
                unlocks: {
                    textlines: [{dialogue: "纳布(沼泽)", lines: ["zz2"]}],
                },
                locks_lines: ["zz1"],
            }),
            "zz2": new Textline({ 
                is_unlocked: false,
                name: "Father, have you ever experienced a Beast Tide before? What is it like?",
                text: "[Nabu] As the name implies......<br>Countless berserk Wild Beasts assault human towns and cities,<br>countless weak common folk lose their homes and are displaced.<br>[Neko] ......So tragic......<br>[Nabu] Koko, the City Lord's Mansion has offered generous rewards this time,<br>taken from what was recovered from the Sky-Outsider by the major territories.<br>Hunt Wild Beasts and bring back proof, and you can claim your reward.",
                unlocks: {
                    textlines: [{dialogue: "纳布(沼泽)", lines: ["zz3"]}],
                },
                locks_lines: ["zz2"],
            }),
            "zz3": new Textline({ 
                is_unlocked: false,
                name: "Father, has Sister already departed with the clan's first group?",
                text: "",
                unlocks: {
                    spec:"3-1-nanami",
                    textlines: [{dialogue: "纳布(沼泽)", lines: ["zz4"]}],
                },
                locks_lines: ["zz3"],
            }),
            "zz4": new Textline({ 
                is_unlocked: false,
                name: "......Understood",
                text: "Alright, it's about time —<br>the next Nayaka Clan contingent has already set out.<br>Get your head in the game and let's move.<br>With the elite cultivators of Yangang City's main force leading the way,<br>there's no need to worry about encountering wandering Domain or Sky-Nimbus Rank Beast Kings.",
                unlocks: {
                    
                    locations: ["赫尔沼泽"],
                },
                locks_lines: ["zz4"],
            }),
        }
    });

    dialogues["结界湖转化器"] = new Dialogue({
        name: "Barrier Lake Converter",
        starting_text: "Exchange <img src='image/item/B3_ear.png'>Wilderness Beast Vouchers for items (including the Converter)",
        textlines: {
            "jjh": new Textline({ 
                is_unlocked: true,
                name: "Convert <img src='image/item/barrierlake_heart.png'>Barrier Lake Heart (must be in the equipment slot)",
                text: "",
                unlocks: {
                    spec:"jjhzx",
                },
            }),
            "pz-my": new Textline({ 
                is_unlocked: true,
                name: "Exchange for <img src='image/item/mythril_ingot.png'>Mithril Ingot (30:1)",
                text: "",
                unlocks: {
                    spec:"pz-my",
                },
            }),
            "pz-bs": new Textline({ 
                is_unlocked: true,
                name: "Exchange for <img src='image/item/gem51_200k.png'>Epic Yellow Gem (80:1)",
                text: "",
                unlocks: {
                    spec:"pz-bs",
                },
            }),
            "pz-Bq": new Textline({ 
                is_unlocked: true,
                name: "Exchange for <img src='image/item/1B.png'>Purple Blade Coin (250:1)",
                text: "",
                unlocks: {
                    spec:"pz-Bq",
                },
            }),


            //20:1 宝石
            //40:1 秘银
            //250:1 紫刀币
        }
    });

    dialogues["峰"] = new Dialogue({
        name: "Feng",
        starting_text: "Talk to the armored young man",
        textlines: {
            "lf1": new Textline({ 
                is_unlocked: false,
                name: "You, you...",
                text: "[???] Thank you.<br>[Neko] Who are you, and why would you be in a place like this?<br>It's way too suspicious!<br>[???] Uh... do I really look suspicious?",
                unlocks: {
                    textlines: [{dialogue: "峰", lines: ["lf2"]}],
                },
                locks_lines: ["lf1"],
            }),
            "lf2": new Textline({ 
                is_unlocked: false,
                name: "And do you know how dangerous that was just now? That big one was Sky Rank 4th Stage!",
                text: "[???] Is that so, Sky Rank 4th Stage...<br>(According to intelligence, that corresponds to Stellar Rank 4th Stage.)<br>With your level of strength, dealing with that Wild Beast just now<br>carried quite considerable risk for you too, didn't it?<br>Even so, you chose to help someone without hesitation?",
                unlocks: {
                    textlines: [{dialogue: "峰", lines: ["lf3"]}],
                },
                locks_lines: ["lf2"],
            }),
            "lf3": new Textline({ 
                is_unlocked: false,
                name: "It was nothing, and it's none of your business — are you looking down on me?",
                text: "",
                unlocks: {
                    textlines: [{dialogue: "峰", lines: ["lf4"]}],
                    spec: "lf-1",
                    flags: ["is_moonwheel_unlocked"],
                },
                locks_lines: ["lf3"],
            }),
            "lf4": new Textline({ 
                is_unlocked: false,
                name: "......Wait! Don't go!",
                text: "[???] Is there something else?<br>[Neko] You...<br>Since you're so capable, guide me out of the forest then.<br>I can't find my way back.<br>[???] Heh heh, alright. Little girl, what's your name?<br>[Neko] ......<br><br>Neko. That's my name. And you?<br>[Feng] My name is <span style='color:aqua'>[Feng]</span>",
                unlocks: {
                    textlines: [{dialogue: "峰", lines: ["lf5"]}],
                },
                locks_lines: ["lf4"],
            }),
            "lf5": new Textline({ 
                is_unlocked: false,
                name: "................Along the way, the two gradually opened up to each other.",
                text: "[Neko] (How to put it...<br>this person, when I first saw him,<br>seemed to be acting very strangely.)<br>(But after walking together for a while,<br>he's unexpectedly easy to get along with.)<br>Feng... you must be older than me,<br>so I'll call you Big Brother Feng.<br>If you don't mind, call me Koko.<br>[Feng] Sure. Koko, you said earlier<br>that this is the heart of Yangang Territory's sphere of influence?<br>And where we're heading<br>is Yangang City, the [Territorial Capital] of Yangang Territory?",
                unlocks: {
                    textlines: [{dialogue: "峰", lines: ["lf6"]}],
                },
                locks_lines: ["lf5"],
            }),
            "lf6": new Textline({ 
                is_unlocked: false,
                name: "Yes, although the Beast Tide has struck,",
                text: "[Neko] All the powerful cultivators of Yangang Territory are out defending against the Beast Tide,<br>so the city is temporarily rather empty.<br>[Feng] In that case... once we're out of the forest,<br>I'll be counting on you to lead the way.<br><br>[Feng] has joined the party!",
                unlocks: {
                    textlines: [{dialogue: "峰", lines: ["lf7"]}],
                    items: [{item_name: "峰"}],
                },
                locks_lines: ["lf6"],
            }),
            "lf7": new Textline({ 
                is_unlocked: false,
                name: "Something's happening!",
                text: "(Baifang appears with a group of Bai Clan members!)<br>[Baifang] Haha, I wondered who it was —<br>turns out it's Miss Neko.<br>(Twist: Our ally Leidong appears)<br>(Intense standoff)<br>(Twist: The enemy's Baiyanta appears)<br>(Another intense standoff)<br>(Twist: The enemy is scared off by Big Brother Feng)",
                unlocks: {
                    textlines: [{dialogue: "峰", lines: ["lf8"]}],
                },
                locks_lines: ["lf7"],
            }),
            "lf8": new Textline({ 
                is_unlocked: false,
                name: "Another turn of events!",
                text: "(The Bai Clan members are robbed by the Thirteen Axes!)<br>(The Bai Clan members can't beat the Thirteen Axes without Restraint potions!)<br>(Baiyanta flees and begs Neko for help!)<br>(The Thirteen Axes think Neko is carrying the valuables and try to rob her!)<br><br>Not gonna lie, she really does have a <span class='coin coin_moneySp'>1.21Δ</span> gem...<br>(<span class='coin coin_moneySp'>1.21Δ</span> goes berserk and wipes out all the Thirteen Axes!)<br>(Uncle Lei suddenly gets excited and urges Neko and Feng to become friends!)",
                unlocks: {
                    textlines: [{dialogue: "峰", lines: ["lf9"]}],
                },
                locks_lines: ["lf8"],
            }),
            "lf9": new Textline({ 
                is_unlocked: false,
                name: "What in the world is even going on...",
                text: "[Feng] Heh heh, never mind. We're safe for now —<br>let's get moving. We can talk when we reach the capital.<br>[Neko] Ugh, what is up with this guy —<br>if he's this strong, why didn't he say so earlier!<br>I spent all that effort saving him,<br>but that Barbarian Beast with a hundred million buffs couldn't even scratch him!",
                unlocks: {
                    locations: ["黑暗森林 - 3"],
                },
                locks_lines: ["lf9"],
            }),
            "lf10": new Textline({ 
                is_unlocked: false,
                name: "Phew — we're finally out of that pitch-black forest.",
                text: "[Leidong] Lord Feng, I know this city very well —<br>if there's somewhere you'd like to go...<br>[Feng] That won't be necessary... let's part ways here.<br>[Neko] Part ways... already?<br>(A flicker of disappointment crosses Neko's expression)<br>[Feng] By the way, where is the best lodging in Yangang City?<br>[Neko] Feiyun Pavilion.<br>[Feng] Good. If you want to find me, head to Feiyun Pavilion.<br><br>[Feng] has left the party!",
                unlocks: {
                    locations: ["飞云阁"],
                    spec:"lf-leave",
                },
                locks_lines: ["lf10"],
            }),
        }
    });
    
    dialogues["峰(飞云)"] = new Dialogue({
        name: "Feng (Feiyun)",
        starting_text: "Talk to Big Brother Feng",
        textlines: {
            "lf11": new Textline({ 
                is_unlocked: true,
                name: "Big Brother Feng... is there something you wanted to ask?",
                text: "Little one, the Arcane Arts you're currently using —<br>where did you get them?",
                unlocks: {
                    textlines: [{dialogue: "峰(飞云)", lines: ["lf12"]}],
                },
                locks_lines: ["lf11"],
            }),
            "lf12": new Textline({ 
                is_unlocked: false,
                name: "...Two years ago, I found them on the Sky-Outsider's vessel.",
                text: "[Feng] This set of Arcane Arts only covers the basics,<br>and there are many imperfections.<br>Let me give you a deeper set to study.<br><br>Feng flicked his fingers lightly; two beams of light shot out and drilled into Neko's brow.<br>Neko felt only a throbbing pain in her head,<br>followed suddenly by a flood of knowledge.<br><br>Starflower - Star Cluster, Starflower - Giant Star, Starflower - Flower Sea<br> have been added to available Arcane Arts!",
                unlocks: {
                    textlines: [{dialogue: "峰(飞云)", lines: ["lf13"]}],
                    stances: ["SF_Power","SF_Lucky","SF_Multi"],
                },
                locks_lines: ["lf12"],
            }),
            "lf13": new Textline({ 
                is_unlocked: false,
                name: "......About this Beast Tide defense,",
                text: "[Neko] Even the rewards the City Lord's Mansion gives to the top few<br>probably can't compare to what Big Brother Feng just gave me.<br>[Feng] The Beast Tide?<br>Speaking of which, there is something suspicious about it.<br>It appears to have been caused by the vessel's crash,<br>but from what I know, the [D9-class Vessel]<br>contains an enormous reactor —<br>and this continent lacks the knowledge to operate it safely.",
                unlocks: {
                    textlines: [{dialogue: "峰(飞云)", lines: ["lf14"]}],
                },
                locks_lines: ["lf13"],
            }),
            "lf14": new Textline({ 
                is_unlocked: false,
                name: "...?",
                text: "Every time this type of Primal Energy reactor explodes,<br>it releases large amounts of [Primal Energy Radiation].<br>Based on the evidence at the scene,<br>to refine a batch of [Supreme Evolution Crystals],<br>this reactor exploded a total of 58 times.",
                unlocks: {
                    textlines: [{dialogue: "峰(飞云)", lines: ["lf15"]}],
                },
                locks_lines: ["lf14"],
            }),
            "lf15": new Textline({ 
                is_unlocked: false,
                name: "But — so many people died because of this, why would anyone...",
                text: "So long as the sacrifice of thousands of the weak<br>can bring about a single powerful cultivator's breakthrough,<br>the value to the clan far outweighs those thousands.<br>Moreover, mutated Wild Beasts are more valuable as materials<br>and make for suitable training targets.<br>Can't accept that? That's fine.<br>After all, I have never detonated a Core Reactor myself.<br>This is ultimately nothing more than my speculation.",
                unlocks: {
                    textlines: [{dialogue: "峰(飞云)", lines: ["lf16"]}],
                },
                locks_lines: ["lf15"],
            }),
            "lf16": new Textline({ 
                is_unlocked: false,
                name: "Suddenly... I've lost all interest in defending against the Beast Tide.",
                text: "These are things a [strong cultivator] must come to understand.<br>Rather than defending against the Beast Tide,<br>there may be a place more suited to you.<br>About ten thousand miles east of Yangang City,<br>there is a secluded place<br>where the flow of time seems to be accelerated.",
                unlocks: {
                    textlines: [{dialogue: "峰(飞云)", lines: ["lf17"]}],
                },
                locks_lines: ["lf16"],
            }),
            "lf17": new Textline({ 
                is_unlocked: false,
                name: "But Big Brother Feng, why don't you go there yourself...",
                text: "There's no need. Those things were left behind by a domain master —<br>a Domain Rank cultivator,<br>and packing them up isn't worth <span class='coin coin_moneySp'>0.01Δ</span> to me;<br>they are meaningless in my eyes.<br>Remember — be very careful.<br>I will leave a spirit imprint on you;<br>use it to communicate with me when you are in danger.<br><br>",
                unlocks: {
                    locations: ["纯白冰原"],
                },
                locks_lines: ["lf17"],
            }),
        }
    });

    dialogues["纳娜米(冰原)"] = new Dialogue({
        name: "Nanami (Ice Plains)",
        textlines: {
            "by1": new Textline({ 
                is_unlocked: true,
                name: "It's so cold... Sister. Why is this snowy plain not marked on the map of Yangang Territory?",
                text: "This must be the place that mysterious cultivator Feng spoke of.<br>The environment is indeed harsh — low temperatures combined with ice elements;<br>Earth Rank cultivators probably risk freezing to death here.",
                //冰元素设定：微型而懒惰的拉普拉斯妖怪，可以在气温并不十分离谱的情况下制造负热量，吸收人的能量

                unlocks: {
                    textlines: [{dialogue: "纳娜米(冰原)", lines: ["by2"]}],
                },
                locks_lines: ["by1"],
            }),
            "by2": new Textline({ 
                is_unlocked: false,
                name: "Can't take it anymore, it's too cold — I'll open the Flame Domain to warm up.",
                text: "[Nanami] Don't use the Domain for something like this...<br>Wait, Koko, have you ever actually closed your Flame Domain?<br>[Neko] Eh...<br>In any case, Sister come closer!<br><br>Nanami has joined the party! Ability effectiveness increased by 5%!",
                //火焰领域设定：高温会让冰元素活化，释放出负热量，但高温领域的量级高于一小片区域的冰元素，起到驱散效果

                unlocks: {
                    items: [{item_name: "纳娜米(冰原)",quality:160}],
                },
                locks_lines: ["by2"],
            }),
        }
    });


    dialogues["极寒相变引擎"] = new Dialogue({
        name: "Frigid Phase-Change Engine",
        starting_text: "Use the [Frigid Phase-Change Engine]",
        textlines: {
            "engine": new Textline({ 
                is_unlocked: false,
                name: "Use the [Frigid Phase-Change Engine]",
                text: "...",
                unlocks: {
                    spec:"freezing-engine",
                },
            }),
        }
    });

    dialogues["冰霜门户"] = new Dialogue({
        name: "Frost Portal",
        textlines: {
            "bs1": new Textline({ 
                is_unlocked:false,
                name: "Huh, what's this? (Touch)",
                text: "Neko's hand touched the icy portal.<br>In an instant, a bone-piercing cold<br>shot through her palm, making her shiver.<br>Before Neko's eyes appeared a long corridor,<br>stretching straight ahead.<br>Both sides were lined with towering, transparent walls of ice.",

                unlocks: {
                    textlines: [{dialogue: "冰霜门户", lines: ["bs2"]}],
                },
                locks_lines: ["bs1"],
            }),
            "bs2": new Textline({ 
                is_unlocked:false,
                name: "(Keep going)",
                text: "Instinctively she walked toward the end of the corridor,<br>and soon saw an ice door,<br>plain and unadorned, glowing with a pale blue light.<br>The power of cold hung in the air almost tangibly,<br>slowly gathering into a sight both strange and familiar —<br>an enormous aquamarine hexagram array!",

                unlocks: {
                    textlines: [{dialogue: "冰霜门户", lines: ["bs3"]}],
                },
                locks_lines: ["bs2"],
            }),
            "bs3": new Textline({ 
                is_unlocked:false,
                name: "A Domain... an ice element Domain!",
                text: "Neko's hand rose of its own accord; flame energy surged,<br>spreading around her,<br>and in an instant collided with the huge ice-blue hexagram!<br>A violent explosion echoed all around,<br>and the whole corridor shook.<br>The shockwave swept outward;<br>cracks spread across the ice walls, then healed just as fast.<br>Gaps opened in the aquamarine hexagram too,<br>and the blazing flame energy slipped in,<br>merging into the hexagram's cracks until it vanished.",

                unlocks: {
                    textlines: [{dialogue: "冰霜门户", lines: ["bs4"]}],
                },
                locks_lines: ["bs3"],
            }),
            "bs4": new Textline({ 
                is_unlocked:false,
                name: "Water nourishes all things... fire illuminates everything...",
                text: "",

                unlocks: {
                    spec:"realm-II",
                    textlines: [{dialogue: "冰霜门户", lines: ["bs5"]}],
                },
                locks_lines: ["bs4"],
            }),
            "bs5": new Textline({ 
                is_unlocked:false,
                name: "……",
                text: "[Nanami] Koko, wake up...<br>Don't scare your big sister.<br>Neko opened her bleary eyes<br>to the sound of her sister's anxious voice.<br>[Nanami] Koko!<br>You suddenly collapsed just now, I thought you...<br>Do you remember what happened?",

                unlocks: {
                    textlines: [{dialogue: "冰霜门户", lines: ["bs6"]}],
                },
                locks_lines: ["bs5"],
            }),
            "bs6": new Textline({ 
                is_unlocked:false,
                name: "(Forms a tiny array) How did you know my Domain broke through?",
                text: "[Nanami] Eh? When did...<br>I see, the Frost Portal just now.<br>That's my Koko, always giving your sister a fright.<br>Speaking of which, I found this in there...<br><br>Obtained [Ten-Thousand-Year Ice Marrow Ingot]!",

                unlocks: {
                    items: [{item_name: "万载冰髓锭"}],
                },
                locks_lines: ["bs6"],
            }),
        }
    });


    dialogues["溪月"] = new Dialogue({
        name: "Xiyue",
        starting_text: "Talk to the mysterious girl who suddenly appeared",
        textlines: {
            "xy1": new Textline({ 
                is_unlocked: false,
                name: "Something's off, sis.",
                text: "[Neko] In the fights before, when those guys died,<br>their \"kin\" weren't scared at all —<br>they charged in even more frantically.<br>That's not how normal people act...<br>If anything, they're more like those emotionless<br>[technological constructs] we ran into before.<br><br>[Nanami] Eh, no way?<br>You mean<br>none of these guys are real humans?<br>[Neko] What real humans would charge in<br>by the thousands like that?",
                unlocks: {
                    textlines: [{dialogue: "溪月", lines: ["xy2"]}],
                },
                
                locks_lines: ["xy1"],
            }),
            "xy2": new Textline({ 
                is_unlocked: false,
                name: "……",
                text: "[???] Congratulations, outsiders,<br>you've cracked this place's secret!<br>As a reward, I'll send you somewhere fun:<br>the [Water Prison].<br>[Nanami] You're... the girl we saw earlier!<br>So it WAS you who deliberately led us here.<br>[Neko] (eyes sparkling) Sounds like an incredible place!",
                unlocks: {
                    textlines: [{dialogue: "溪月", lines: ["xy3"]}],
                    locations: ["时封水牢"],
                },
                
                locks_lines: ["xy2"],
            }),
            "xy3": new Textline({ 
                is_unlocked: false,
                name: "Sis, sis, wake up...",
                text: "[Nanami] Ugh, Koko...?!<br>Thank goodness, you're still here...<br>[Neko] I'm fine... that girl didn't kill us,<br>she just dumped us here...<br>[Xiyue] Welcome, you two cute little ladies.<br>Hehe, I'm still here. Rather than [that girl],<br>you'd better call me [Xiyue].",
                unlocks: {
                    textlines: [{dialogue: "溪月", lines: ["xy4"]}],
                },
                locks_lines: ["xy3"],
            }),
            "xy4": new Textline({ 
                is_unlocked: false,
                name: "Were you the one guiding us? Why?",
                text: "[Xiyue] It was all the master's arrangement.<br>Though I never expected<br>this batch of outsiders to be so cute, hehe.<br>You two — in this Water Prison<br>are held several hundred Sky Rank powerhouses,<br>ranging from Sky Rank Stage 1-2 to Stage 5-6.<br>To get out, the method is simple —<br>kill every powerhouse in this Water Prison!<br>The exit opens for the final victor.",
                unlocks: {
                    textlines: [{dialogue: "溪月", lines: ["xy5"]}],
                },
                locks_lines: ["xy4"],
            }),
            "xy5": new Textline({ 
                is_unlocked: false,
                name: "(Stunned)",
                text: "[Neko] Only a few hundred?<br>Breaking into Sky Rank Stage 6 alone takes 1120T XP.<br>That's nowhere near enough!<br><br>[Xiyue] Hehe, there's also the barrier the master set up here.<br>Nurtured by the abundant water element,<br>this place spawns water [Spirits] up to Sky Rank Stage 7.<br>In short,<br>there's more than enough combat XP!<br>You're free to run around wherever you like,<br>but Sky Rank Stage 7 enemies aren't found just anywhere!<br>Well, my job here is done.<br>Good luck, bye-bye.",
                unlocks: {
                    textlines: [{dialogue: "溪月", lines: ["xy6"]}],
                },
                locks_lines: ["xy5"],
            }),
            "xy6": new Textline({ 
                is_unlocked: false,
                name: "Hey, hey!",
                text: "[Nanami] Looks like she's really gone.<br>[Neko] What do we do now, sis...<br>There's not a single [Spirit] here.<br>[Nanami] Not necessarily.<br>Maybe we could seek out the powerhouses in the Water Prison<br>and try talking to them.<br>[Neko] Eh, go find them?<br>[Nanami] They're probably troubled by the [Spirit] attacks too.<br>Helping deal with the [Spirits] sounds like a win-win.",
                unlocks: {
                    textlines: [{dialogue: "竺虎", lines: ["zh1"]}],
                },
                locks_lines: ["xy6"],
            }),
        }
    });

    

    dialogues["竺虎"] = new Dialogue({
        name: "Zhu Hu",
        
        textlines: {
            "zh1": new Textline({ 
                is_unlocked: false,
                name: "…",
                text: "[Zhu Hu] Oh ho, new faces?<br>Heh, this Water Prison hasn't had newcomers in a while.<br><br>[Nanami] Hello,<br>are you a powerhouse imprisoned here too?<br><br>[Zhu Hu] Yeah, locked up here a few hundred years ago.<br>Oh, you, the little girl over there —<br>that weapon in your hands is rather nice.",
                unlocks: {
                    textlines: [{dialogue: "竺虎", lines: ["zh2"]}],
                },
                
                locks_lines: ["zh1"],
            }),
            "zh2": new Textline({ 
                is_unlocked: false,
                name: "Are you talking to me...?",
                text: "[Zhu Hu] That's right, tsk tsk,<br>looks like a very high-quality psychic weapon.<br>In that case, I'll help myself to it.",
                unlocks: {
                    textlines: [{dialogue: "竺虎", lines: ["zh3"]}],
                },
                
                locks_lines: ["zh2"],
            }),
            "zh3": new Textline({ 
                is_unlocked: false,
                name: "I, I can't just give you this!",
                text: "[Zhu Hu] Hahaha, how naive.<br>Newbies, you don't know the rules here yet.<br>The strong rule here, and killing is routine.<br>Two early Sky Rank... huh?!<br>Is it too late to beg for mercy now?",
                unlocks: {
                    textlines: [{dialogue: "竺虎", lines: ["zh4"]}],
                },
                
                locks_lines: ["zh3"],
            }),
            "zh4": new Textline({ 
                is_unlocked: false,
                name: "If you want a fight, just say so...",
                text: "[Nanami] In that case,<br>no more words — you can die right here.<br>(Koko, I'll leave taking this guy down to you!)",
                unlocks: {
                    locations: ["时封水牢 - I"],
                },
                
                locks_lines: ["zh4"],
            }),
            "zh5": new Textline({ 
                is_unlocked: false,
                name: "So now, who exactly is going to die here?",
                text: "[Zhu Hu] Naive! No matter how well you fight,<br>the limits of your realm...............<br><br>(Deathly silence)",
                unlocks: {
                    textlines: [{dialogue: "竺虎", lines: ["zh6-1"]},{dialogue: "竺虎", lines: ["zh6-2"]}],
                },
                
                locks_lines: ["zh5"],
            }),
            "zh6-1": new Textline({ 
                is_unlocked: false,
                name: "Spare him",
                text: "[Neko] Since I'm in a good mood today,<br>you may go~<br><br>[Zhu Hu] Then I'll take my leave, my ladies —",
                unlocks: {
                    textlines: [{dialogue: "竺虎", lines: ["zh7"]}],
                },
                
                locks_lines: ["zh6-1","zh6-2"],
            }),
            "zh6-2": new Textline({ 
                is_unlocked: false,
                name: "<span style='color:red'><b>Kill</b></span>",
                text: "[Zhu Hu] Spare me —<br><br>(Sound of the Moonwheel cutting)<br><br>[Neko] Alright, let's just bury him like this.<br>[Nanami] You've grown up...<br><br>Obtained Swamp Beast Meat x5!<br>Obtained Crystallized Sword (Quality 239%)!<br>Obtained <span class='coin coin_moneyT'>259B</span> <span class='coin coin_moneyB'>346D</span> <span class='coin coin_moneyM'>107Z</span> <span class='coin coin_moneyK'>197X</span> <span class='coin coin_copper'>56C</span>!",
                unlocks: {
                    spec:"kill-zh",
                    textlines: [{dialogue: "竺虎", lines: ["zh7"]}],
                },
                
                locks_lines: ["zh6-1","zh6-2"],
            }),
            "zh7": new Textline({ 
                is_unlocked: false,
                name: "Honestly, talking tough when you're clearly outmatched.",
                text: "[Nanami] (Water Prison power assessment omitted here)<br>Remember what you said before,<br>inside the ship of the visitors from beyond the sky?<br>[Neko] What did I say?<br>[Nanami] You said if you reached Sky Rank Stage 9 inside the ship,<br>all our troubles would be solved!<br><br>As if struck by sudden enlightenment, Neko seemed to realize something, and her eyes lit up.",
                unlocks: {
                    textlines: [{dialogue: "竺虎", lines: ["zh8"]}],
                },
                
                locks_lines: ["zh7"],
            }),
            "zh8": new Textline({ 
                is_unlocked: false,
                name: "But sis, level suppression cuts XP by 80%.",
                text: "[Nanami] That penalty only applies<br>once you've surpassed everyone.<br>And once you've surpassed everyone,<br>doesn't the danger cease to exist?<br><br>[Neko] That makes sense.",
                unlocks: {
                    locations: ["时封水牢 - 1"],
                },
                
                locks_lines: ["zh8"],
            }),
        }
    });
    
    dialogues["莫尔"] = new Dialogue({
        name: "Mo'er",
        textlines: {
            "mr1": new Textline({ 
                is_unlocked: false,
                name: "You came looking for us — what do you want?",
                text: "Don't worry, I have no intention of fighting you.<br>I just want to see for myself how wondrous a [Domain]<br>that can suppress Zhu Hu really is.",
                unlocks: {
                    textlines: [{dialogue: "莫尔", lines: ["mr2"]}],
                },
                locks_lines: ["mr1"],
            }),
            "mr2": new Textline({ 
                is_unlocked: false,
                name: "Not interested, and that's weird.",
                text: "[Neko] Trapped in a prison, living day to day,<br>and you're still thinking about sparring...<br><br>[Mo'er] I know the dangers here far better than you.<br>But compared to growing stronger, what does that matter?<br>I can tell you this:<br>the few strongest in this Water Prison<br>all have strange tempers.<br>Power Ranking publisher [Lanqi], Fallen Leaf Blade [Qiuxing] and the like —<br>each is dozens of times stronger than me.",
                unlocks: {
                    textlines: [{dialogue: "莫尔", lines: ["mr3"]}],
                },
                locks_lines: ["mr2"],
            }),
            "mr3": new Textline({ 
                is_unlocked: false,
                name: "…",
                text: "[Nanami] So, do you think we'd agree?<br>Fighting here does us no good,<br>and might draw other powerhouses.<br><br>[Mo'er] Yes, that's true.<br>I expected you two wouldn't agree easily, but —<br>this is no rash offense; it's a trade.",
                unlocks: {
                    textlines: [{dialogue: "莫尔", lines: ["mr4"]}],
                },
                locks_lines: ["mr3"],
            }),
            "mr4": new Textline({ 
                is_unlocked: false,
                name: "Eh? What trade? What are you talking about?",
                text: "[Mo'er] Cute little one, the weapon in your hands is very strong.<br>I studied psychic weapons for a long time;<br>your Moonwheel's structure is at least peak spirit-treasure grade.<br>Even Nimbus Rank powerhouses would flock to it.<br>But for now you can't bring out its power.<br>And I might be able to help.<br>[Neko] You mean!<br><br>[Mo'er] If I win, I won't do anything.<br>I only ask to learn from your comprehension,<br>or to hear your views on the path of Domains.",
                unlocks: {
                    textlines: [{dialogue: "莫尔", lines: ["mr5"]}],
                },
                locks_lines: ["mr4"],
            }),
            "mr5": new Textline({ 
                is_unlocked: false,
                name: "(Can he really be trusted...)",
                text: "[Mo'er] I know what you're worried about.<br>I swear on my reputation as a Power Ranking powerhouse<br>that I won't pull any tricks.<br>Besides, if word of some shady deed<br>got out of here,<br>it would mean ruin and disaster.<br><br>[Neko] Fine... I accept. In that case, let's begin.",
                unlocks: {
                    locations: ["时封水牢 - II"],
                },
                locks_lines: ["mr5"],
            }),
            "mr6": new Textline({ 
                is_unlocked: false,
                name: "(……)",
                text: "As agreed, Mo'er taught Neko everything he knew<br>about psychic weapons, holding nothing back.<br>Only now did she realize<br>that the Water Prison wasn't only kill-or-be-killed;<br>there were plenty like Mo'er, devoted purely to cultivation.<br>Talking with him, she could feel his hunger to grow stronger,<br>a hunger he valued even above survival.<br>Soon, the Moonwheel built from 216 white crystals<br></br>bloomed with an even more gorgeous light in the girl's hands...<br>[Silver Frost Moonwheel] gained 299Qi (2.99e20) XP!",
                unlocks: {
                    spec:"moonwheel-lv40",
                },
                locks_lines: ["mr6"],
            }),
        }
    });

    dialogues["秋兴"] = new Dialogue({
        name: "Qiuxing",
        textlines: {
            "qx1": new Textline({ 
                is_unlocked: false,
                name: "(Fallen Leaf Blade...! The third-ranked Fallen Leaf Blade!)",
                text: "[Qiuxing] Aha, I know what you want to say.<br>Actually, I found your hiding place long ago.<br>I was just waiting for you to grow<br>until you could stand against me.",
                unlocks: {
                    textlines: [{dialogue: "秋兴", lines: ["qx2"]}],
                },
                locks_lines: ["qx1"],
            }),
            "qx2": new Textline({ 
                is_unlocked: false,
                name: "If you want stronger opponents, why keep fixating on us?",
                text: "[Qiuxing] Hahaha,<br>little girl, when you see a fun toy,<br>could you bear to leave it alone?",
                unlocks: {
                    textlines: [{dialogue: "秋兴", lines: ["qx3-1"]},{dialogue: "秋兴", lines: ["qx3-2"]}],
                },
                locks_lines: ["qx2"],
            }),
            "qx3-1": new Textline({ 
                is_unlocked: false,
                name: "...By 'fun toy', you mean us?",
                text: "[Qiuxing] Smart! That's right, I just think it's fun,<br>so I want to play with you.<br>Naturally, if you can satisfy me,<br>I'll let you leave.<br>My, what a pretty little thing...<br>Let me have a look.<br><br>Qiuxing reached out,<br>making as if to touch Neko's cheek.",
                unlocks: {
                    textlines: [{dialogue: "秋兴", lines: ["qx4"]}],
                },
                locks_lines: ["qx3-1","qx3-2"],
            }),
            "qx3-2": new Textline({ 
                is_unlocked: false,
                name: "(Takes out the Frigid Phase-Change Engine) I've left THIS one alone!",
                text: "[Qiuxing] Huh? (push, pull, push, pull)<br>This isn't a toy at all!<br>You two are much more fun than this.<br>My, what a pretty little thing...<br>Let me have a look.<br><br>Qiuxing reached out,<br>making as if to touch Neko's cheek.",
                unlocks: {
                    textlines: [{dialogue: "秋兴", lines: ["qx4"]}],
                },
                locks_lines: ["qx3-1","qx3-2"],
            }),
            "qx4": new Textline({ 
                is_unlocked: false,
                name: "Smack —",
                text: "[Nanami] Pah, shameless scum, don't touch Koko,<br>or you'd better pray nothing happens to you.<br><br>[Qiuxing] Oh my, the young lady has quite a temper.<br>But does your strength match your temper?",
                unlocks: {
                    locations: ["时封水牢 - III"],
                },
                locks_lines: ["qx4"],
            }),
            "qx5": new Textline({ 
                is_unlocked: false,
                name: "You... why did you hold back?",
                text: "[Qiuxing] What? Must I fight such a cute little sister<br>to the death? Hahaha...<br>(Some story about the Water Prison's power distribution omitted)<br>(Lanqi doesn't have overwhelming strength,<br>but due to infighting among the rebels,<br>no rebellion against Lanqi has ever succeeded)<br><br>Learned the path of Domains from Qiuxing!<br>[Water Element Affinity] gained 39.97M XP!",
                unlocks: {
                    spec:"realm-III",
                    locations: ["时封水牢 - 5"],
                    textlines: [{dialogue: "秋兴", lines: ["qx6-1"]},{dialogue: "秋兴", lines: ["qx6-2"]},{dialogue: "秋兴", lines: ["qx6-3"]}],
                },
                locks_lines: ["qx5"],
            }),
            
            "qx6-1": new Textline({ 
                is_unlocked: false,
                name: "<span style='color:red'><b>Kill</b></span>",
                text: "[Qiuxing] No... please... I'll do anything!<br><br>(Sound of the Moonwheel cutting)<br><br>[Neko] Ugh, why did I do that...<br>[Nanami] ...Koko, I don't recognize you anymore.<br><br><br>Obtained <span class='coin coin_moneyT'>923B</span> <span class='coin coin_moneyB'>124D</span> <span class='coin coin_moneyM'>981Z</span> <span class='coin coin_moneyK'>247X</span> <span class='coin coin_copper'>561C</span>!<br>The <span style='color:aqua'>Bing Clan</span>'s opinion of Neko dropped sharply!",
                unlocks: {
                    spec:"qx-kill",
                },
                locks_lines: ["qx6-1","qx6-2","qx6-3"],
            }),
            "qx6-2": new Textline({ 
                is_unlocked: false,
                name: "<span style='color:red'><b>Subdue</b></span>",
                text: "(Neko crouches down and lifts Qiuxing's chin)<br>Now who's the cute little sister?<br>Domain Stage 3: Flame-Sea Frost Sky — Flame Sea, open!<br>With 1280K of heat<br>and the fierce currents that came with it,<br>Qiuxing's clothes were instantly torn open in several huge rips.<br>Three [Ice Seal] crystals extracted from goblins<br>were triggered one after another, freezing Qiuxing. With the other side unable to resist,<br>the three crystals chained together into continuous control.<br>...<br>...<br>After a full Xuelo day of this,<br>Neko finally finished off the goblins<br>and carried Qiuxing back to the cave dwelling.<br><br>Qiuxing developed special feelings toward Neko!",
                unlocks: {
                    spec:"qx-sox",
                },
                locks_lines: ["qx6-1","qx6-2","qx6-3"],
            }),
            "qx6-3": new Textline({ 
                is_unlocked: false,
                name: "<b>Leave</b>",
                text: "[Neko] You can go now~<br>Come back and talk Domains sometime when you're free?<br><br>[Qiuxing]",
                unlocks: {
                },
                locks_lines: ["qx6-1","qx6-2","qx6-3"],
            }),
        }
    });


    dialogues["蓝柒"] = new Dialogue({
        name: "Lanqi",
        textlines: {
            "lq1": new Textline({ 
                is_unlocked: false,
                name: "(The aura of a powerhouse... so she's here after all?)",
                text: "[Lanqi] ...<br><br>[Nanami] You were watching the whole time, weren't you,<br>our fight with Qiuxing.<br>Otherwise you wouldn't have rated Koko<br>third on the Power Ranking —<br>or rather, have you been watching from the shadows<br>for many of the fights in the Water Prison?<br><br>[Lanqi] ...",
                unlocks: {
                    textlines: [{dialogue: "蓝柒", lines: ["lq2"]}],
                },
                locks_lines: ["lq1"],
            }),"lq2": new Textline({ 
                is_unlocked: false,
                name: "Sis, hold on a second...",
                text: "[Nanami] Koko, it's really annoying when you interrupt me at times like this...<br><br>[Lanqi] ...<br>Stop growing any further.<br>Something terrible will happen.",
                unlocks: {
                    textlines: [{dialogue: "蓝柒", lines: ["lq3"]}],
                },
                locks_lines: ["lq2"],
            }),"lq3": new Textline({ 
                is_unlocked: false,
                name: "What do you mean...?",
                text: "[Lanqi] There's a special reason.<br>Anyway, don't go any further. This is a warning —",
                unlocks: {
                    locations: ["时封水牢 - IV"],
                },
                locks_lines: ["lq3"],
            }),"lq4": new Textline({ 
                is_unlocked: false,
                name: "……",
                text: "[Lanqi] Let it end here. This is my final advice.<br>The way out of this place isn't what you think.<br>Goodbye.<br><br>[Nanami] She just left?<br>This wasn't what we expected.",
                unlocks: {
                    textlines: [{dialogue: "蓝柒", lines: ["lq5"]}],
                },
                locks_lines: ["lq4"],
            }),"lq5": new Textline({ 
                is_unlocked: false,
                name: "I don't get it. Qiuxing didn't seem to be talking straight earlier either.",
                text: "[Neko] Is that girl really Lanqi?<br>She's strong for sure, but she doesn't match what we heard.<br>I didn't even... sense any malice from her.<br><br>[Nanami] More and more doubts.<br>Was she saying there's a different way<br>to escape this Water Prison?<br>[Neko] Let's go back, sis.<br>We'll make plans a little later.",
                unlocks: {
                    
                    items: [{item_name: "传说红宝石"}],
                },
                locks_lines: ["lq5"],
            }),"lq6": new Textline({ 
                is_unlocked: false,
                name: "……",
                text: "[Lanqi] You're strong...<br>but to break free,<br>it's not enough...",
                unlocks: {
                    textlines: [{dialogue: "蓝柒", lines: ["lq7"]}],
                },
                locks_lines: ["lq6"],
            }),"lq7": new Textline({ 
                is_unlocked: false,
                name: "Can I ask something?",
                text: "[Nanami] When you saw us arrive here,<br>why did you lose your composure like that?<br><br>[Lanqi] I'd rather not answer that...<br>Maybe... you'll understand soon enough.<br>But there's nothing more I can do to help you.<br>",
                unlocks: {
                    locations: ["水牢走廊"],
                    textlines: [{dialogue: "蓝柒", lines: ["lq8-1"]},{dialogue: "蓝柒", lines: ["lq8-2"]},{dialogue: "蓝柒", lines: ["lq8-3"]}],
                },
                locks_lines: ["lq7"],
            }),
            "lq8-1": new Textline({ 
                is_unlocked: false,
                name: "<span style='color:red'><b>Kill</b></span>",
                text: "[Lanqi] If... this is what the Water Prison is in your hearts...<br><br>(Sound of the Moonwheel cutting)<br><br>[Neko] Someone important... a dependable senior...<br>When did I become like this?<br>[Nanami] ...Koko, don't kill me, I'm scared...<br><br><br>Obtained <span class='coin coin_moneyQa'>5U</span> <span class='coin coin_moneyT'>810B</span> <span class='coin coin_moneyB'>358D</span> <span class='coin coin_moneyM'>643Z</span> <span class='coin coin_moneyK'>364X</span> <span class='coin coin_copper'>656C</span>!<br>The <span style='color:aqua'>Bing Clan</span>'s opinion of Neko dropped sharply!",
                unlocks: {
                    spec:"lq-kill",
                },
                locks_lines: ["lq8-1","lq8-2","lq8-3"],
            }),
            "lq8-2": new Textline({ 
                is_unlocked: false,
                name: "<span style='color:red'><b>Subdue</b></span>",
                text: "To Neko, Lanqi had long been a powerhouse shrouded in mystery.<br>Seizing the chance, she decided to bring Lanqi back to the cave dwelling<br>for a thorough \"interrogation\" to get to the bottom of things.<br>[Neko] Dungeon Frenzy Potion~ Ruin Frenzy Potion~<br>Don't even think about recovering your strength and resisting me~<br>[Lanqi] You're strong... but... not enough...<br>[Neko] Give it a rest already. Would Domain Stage 4 be enough for you?<br>(Neko takes out a bucket of otherworld potion and downs it in one go!)<br><br>Under multipliers that kept climbing every round,<br>Lanqi ultimately couldn't withstand Neko's \"attacks\".<br><br>Lanqi developed special feelings toward Neko!",
                unlocks: {
                    spec:"lq-sox",
                },
                locks_lines: ["lq8-1","lq8-2","lq8-3"],
            }),
            "lq8-3": new Textline({ 
                is_unlocked: false,
                name: "<b>Leave</b>",
                text: "If you want to move on, go ahead.<br>May the great immortal deities protect you.",
                unlocks: {
                },
                locks_lines: ["lq8-1","lq8-2","lq8-3"],
            }),
        }
    });


    dialogues["溪月 II"] = new Dialogue({
        name: "Xiyue II",
        starting_text: "Talk to the pink-haired girl in the corridor",
        textlines: {
            "xy7": new Textline({ 
                is_unlocked: true,
                name: "…",
                text: "Congratulations, you've passed!",
                unlocks: {
                    textlines: [{dialogue: "溪月 II", lines: ["xy8"]}],
                },
                
                locks_lines: ["xy7"],
            }),
            "xy8": new Textline({ 
                is_unlocked: false,
                name: "Passed... you're the girl from the glacial plain earlier.",
                text: "[Nanami] Does this really count as passing?<br>We didn't kill all the powerhouses in the Water Prison.<br><br>[Xiyue] Killing each other isn't the only way to pass.<br>If you reach Domain Stage 3, this passage opens for you naturally.<br>Confusing, isn't it?<br>Don't worry, you'll understand soon.",
                unlocks: {
                    textlines: [{dialogue: "溪月 II", lines: ["xy9"]}],
                },
                
                locks_lines: ["xy8"],
            }),
            "xy9": new Textline({ 
                is_unlocked: false,
                name: "Can you tell us what this place actually is?",
                text: "[Xiyue] Hmm, that? Of course.<br>This is a barrier built by the master.<br>They say it's a million years old — pretty amazing, huh.",
                unlocks: {
                    textlines: [{dialogue: "溪月 II", lines: ["xy10"]}],
                },
                
                locks_lines: ["xy9"],
            }),
            "xy10": new Textline({ 
                is_unlocked: false,
                name: "Wait, master?",
                text: "[Xiyue] You know, the powerhouses locked up here<br>may be trapped with no way out...<br>but as long as they don't break the rules,<br>they can live safely for many years<br>and raise their strength to astonishing levels.<br><br>Of course, the Water Prison lacks cultivation resources.<br>Powerhouses who might have broken into Sky Rank Stage 9<br>can only polish themselves to Sky Rank Stage 6 [IV] here,<br>enough to rival someone just entering Sky Rank Stage 8.<br><br>[PS/Lore note]<br>Unless stated otherwise, 2+ equals one minor realm.<br>To keep realm names from getting too long,<br>3+ and above are shown as Roman numerals.",
                unlocks: {
                    textlines: [{dialogue: "溪月 II", lines: ["xy11"]}],
                },
                
                locks_lines: ["xy10"],
            }),
            "xy11": new Textline({ 
                is_unlocked: false,
                name: "But... do you know how many people died in the meantime?",
                text: "[Xiyue] Oh my, what an innocent child.<br>I hate to say it, but let me explain.<br>These are necessary sacrifices to raise powerhouses.<br>Out of hundreds of Sky Ranks fighting each other,<br>if even one Nimbus Rank is born —<br>that Nimbus Rank's value<br>exceeds, hmm... let me count...<br>depending on stage,<br>the sum of 100 thousand to 3.1 billion Sky Rank Stage 1s!<br><br>In the end, only thirty thousand Sky Ranks have died here in a million years!<br>Look at your own kill count in the top right —<br>what right do you have to judge the master!",
                unlocks: {
                    textlines: [{dialogue: "溪月 II", lines: ["xy12"]}],
                },
                
                locks_lines: ["xy11"],
            }),
            "xy12": new Textline({ 
                is_unlocked: false,
                name: "Then, what should we, the victors, do now?",
                text: "[Xiyue] You're now qualified to receive the inheritance!<br>Next, let me take you to meet the master.<br>How much comprehension XP and cultivation insight you get<br>in the Inheritance Realm is up to you.<br><br>[Neko] I... can't accept this.<br>[Nanami] ...Koko, let's follow her.",
                unlocks: {
                    textlines: [{dialogue: "溪月 II", lines: ["xy13"]}],
                },
                
                locks_lines: ["xy12"],
            }),
            "xy13": new Textline({ 
                is_unlocked: false,
                name: "No, that's not what I meant...",
                text: "[Neko] The sum of 100 thousand to 3.1 billion Sky Rank Stage 1s!<br>If we could raise a few Nimbus Rank powerhouses,<br>there'd be an endless flood of <span class='coin coin_moneyT'>Treasure Coins</span> and <span class='coin coin_moneyQa'>Cosmic Coins</span>...<br>Once the inheritance is done, it's time to consolidate the clan!<br>I feel like I'm ready to challenge Father now.<br>(You Sky Rank: Pinnacle [-4] old man!<br>Your time is over!)",
                unlocks: {
                    textlines: [{dialogue: "溪月 II", lines: ["xy14"]}],
                },
                
                locks_lines: ["xy13"],
            }),
            "xy14": new Textline({ 
                is_unlocked: false,
                name: "(Shakes it off) Pull yourself together...",
                text: "[???] Little girl, making it this far<br>shows admirable courage and nerve.<br>[Zuo'a] First, let me introduce myself.<br>Zuo'a, former young sect master of Yangang Territory's Hunyuan Sect.<br>[Nanami] Zuo'a?! You're...<br>the senior recorded in Yangang Territory's history books?<br>[Zuo'a] Haha, correct. After all these years,<br>a junior still remembers my name —<br>it seems the world hasn't entirely forgotten me.",
                unlocks: {
                    textlines: [{dialogue: "溪月 II", lines: ["xy15"]}],
                },
                
                locks_lines: ["xy14"],
            }),
            "xy15": new Textline({ 
                is_unlocked: false,
                name: "(Sis... I never read the history books. Who is he?)",
                text: "[Nanami] A senior master from about a hundred thousand years ago...<br>whose conflict with the sect master destroyed the once-mighty [Hunyuan Sect].<br>[Zuo'a] Hehe, voice transmission can't escape my senses here.<br>Back then, I was born to an outer-disciple family,<br>mediocre in talent and ignored by all.<br>Later, I awakened an innate primordial spirit body,<br>and only then rose rapidly to become one of the sect's leaders.<br><br>[Neko] Eh? How does an innate primordial spirit body awaken later in life?<br>[Zuo'a] Ahem... anyway, the sect master wanted to possess my body!<br>As a Nimbus Rank: Pinnacle,<br>I took him down with me.<br>But in the instant of my death, I stepped into Domain Rank.",
                unlocks: {
                    textlines: [{dialogue: "溪月 II", lines: ["xy16"]}],
                },
                
                locks_lines: ["xy15"],
            }),
            "xy16": new Textline({ 
                is_unlocked: false,
                name: "Phew...",
                text: "[Zuo'a] And so it ended up like this —<br>living on in this barrier in a twisted form.<br>Since you braved great danger to come here<br>and passed the trials I laid out,<br>naturally I can't let you leave empty-handed.<br>[Zuo'a] Now, open your body and mind,<br>enter the Inheritance Realm and receive my inheritance.<br>I'm only responsible for sending you into the illusion;<br>how much you comprehend depends on your fortune.<br>Remember, the inheritance is granted only to the fated...<br>I've hogged Xiyue's dialogue box long enough;<br>time for a rest.",
                unlocks: {
                    textlines: [{dialogue: "溪月 II", lines: ["xy17"]}],
                },
                
                locks_lines: ["xy16"],
            }),
            "xy17": new Textline({ 
                is_unlocked: false,
                name: "(A flash of light before her eyes)",
                text: "As Zuo'a's voice faded,<br>white light bloomed before Neko and Nanami's eyes,<br>as if trying to pull the souls from their bodies.<br>The white light lasted a moment, and then, at the center of the space,<br>a huge vortex formed.<br><br>Faintly, colored light shimmered within the vortex.<br>As the light in the vortex grew brighter,<br>Neko could finally make out her surroundings,<br>and slowly opened her eyes.<br><br>Entered the Inheritance Realm. Nanami... never mind, I won't take her this time.<br>You probably have the Glacial Plain Heart by now anyway...",
                unlocks: {
                    locations: ["传承幻境"],
                },
                
                locks_lines: ["xy17"],
            }),

            
        }
    });

    dialogues["传承水晶"] = new Dialogue({
        name: "Inheritance Crystal",
        starting_text: "Touch the glowing crystal",
        textlines: {
            "sj1": new Textline({ 
                is_unlocked: false,
                name: "(Touch)",
                text: "[Neko] As expected, these crystals<br>hold Senior Zuo'a's insights!<br>Such powerful force...<br>but mixed with an intense, violent aura.<br>Senior Zuo'a, what on earth did you go through?<br>I must calm my mind and focus...<br>Well, I'm hardly one to talk.",
                unlocks: {
                    textlines: [{dialogue: "传承水晶", lines: ["sj2"]}],
                },
                
                locks_lines: ["sj1"],
            }),
            "sj2": new Textline({ 
                is_unlocked: false,
                name: "(Close eyes)",
                text: "[Neko] ...With just a brief touch,<br>many parts of the arcane art I hadn't yet mastered<br>suddenly became clear.<br>This is the art Big Bro Feng gave me;<br>its true potential really is extraordinary.<br>(Inner monologue: the cap IS level 50, after all!)<br>Kind of exciting — how strong will it be once the transformation succeeds?<br><br>Comprehended a new Arcane Art:<span style='color:aqua'> [Starlight Violet Radiance]</span>!<br>Equip it from the equipment panel.",
                unlocks: {
                    items: [{item_name: "映星紫华",quality:200}],
                },
                
                locks_lines: ["sj2"],
            }),

        }
    });

    dialogues["纳娜米?"] = new Dialogue({
        name: "Nanami?",
        starting_text: "Talk to big sis in the Underground Palace... is it really her?",
        textlines: {
            "hx1": new Textline({ 
                is_unlocked: false,
                name: "Eh, sis... what did you say?",
                text: "[Nanami] Koko! You're finally awake!<br>You used up too much strength fighting the monsters<br>in the Underground Palace and passed out.<br>But don't worry, your big sister<br>just cleared out every monster in this area.<br>I'll protect you.",
                unlocks: {
                    textlines: [{dialogue: "纳娜米?", lines: ["hx2"]}],
                },
                
                locks_lines: ["hx1"],
            }),
            "hx2": new Textline({ 
                is_unlocked: false,
                name: "Sis, while I was passed out just now",
                text: "[Neko] you were... clearing the monsters in this area, right?<br><br>[Nanami?] Yes, so stop worrying.<br>With me here, these are all small problems...",
                unlocks: {
                    textlines: [{dialogue: "纳娜米?", lines: ["hx3"]}],
                },
                
                locks_lines: ["hx2"],
            }),
            "hx3": new Textline({ 
                is_unlocked: false,
                name: "You... you're not my sister!",
                text: "[Neko] Before entering the illusion,<br>sis was only Sky Rank Stage 6!<br>No way she could beat Stage 8 or 9 enemies.<br><br>[Nanami?] .........<br><br>[Neko] Are you listening? I finally get it.<br>Everything I'm seeing is an illusion,<br>not time flowing backward.<br>Who are you really?",
                unlocks: {
                    textlines: [{dialogue: "纳娜米?", lines: ["hx4"]}],
                },
                
                locks_lines: ["hx3"],
            }),
            "hx4": new Textline({ 
                is_unlocked: false,
                name: "Who are you really?",
                text: "[Neko] You're the Inner Demon in my heart! Right?!<br><br><del>[Nanami?]</del>[Meowgula]<br>Congratulations, wrong answer! I'm<br>a Fluffy the same color as your sister's clothes!<br>Unlike that idiot Inner Demon, I don't use Suppress!",
                unlocks: {
                    locations: ["幻境核心 - I"],
                },
                
                locks_lines: ["hx4"],
            }),

        }
    });
    
    dialogues["纳鹰?"] = new Dialogue({
        name: "Naying?",
        starting_text: "Talk to the ancestor in the Barrier Lake... it's definitely fake!",
        textlines: {
            "hx5": new Textline({ 
                is_unlocked: false,
                name: "Senior Naying... no, you're not the senior!",
                text: "[Naying?] Oh ho ho, seems there's been a little accident.<br>Little girl, don't panic.<br>You took in a great deal of knowledge at once,<br>which will inevitably cause a brief hyperactive period in your consciousness,<br>even conjuring up many phantoms that don't exist.<br>",
                unlocks: {
                    textlines: [{dialogue: "纳鹰?", lines: ["hx6"]}],
                },
                
                locks_lines: ["hx5"],
            }),
            "hx6": new Textline({ 
                is_unlocked: false,
                name: "Phantoms? Wh-what are you talking about...",
                text: "[Naying?] Listen, little girl,<br>cast aside those jumbled thoughts in your mind.<br>I'll pass my comprehension of Domains on to you;<br>it may shape the path ahead of you.<br>In the future, you may even possess a Domain —",
                unlocks: {
                    textlines: [{dialogue: "纳鹰?", lines: ["hx7"]}],
                },
                
                locks_lines: ["hx6"],
            }),
            "hx7": new Textline({ 
                is_unlocked: false,
                name: "My... my Domain?",
                text: "[Neko] Listen, old man! I DO have a Domain —<br>and it's at Domain Stage 3 Pinnacle!<br>[Naying?] ...(dissipates)<br>[Neko] Phew... this one's true form was the Inner Demon itself,<br>so at least I was spared a hard fight.<br>I feel like I understand it a layer deeper now.<br>If this keeps up,<br>I wonder if I can go one step further...",
                unlocks: {
                    locations: ["幻境核心·战场"],
                },
                
                locks_lines: ["hx7"],
            }),
        }
    });
    


    dialogues["烈日神像"] = new Dialogue({
        name: "Blazing Sun Statue",
        starting_text: "Pay respects to the Blazing Sun statue in the Illusion Battlefield",
        textlines: {
            "lr1": new Textline({ 
                is_unlocked: true,
                name: "(A not-so-reverent little bow)",
                text: "[Blazing Sun Projection]<br>Ahem... my little brother Moonlight told me about you.<br>Anyway, this statue is made of better material!<br>It needs more than Blade Coins though — some Cosmic Coins too...<br>In return, you can receive the Blazing Sun's blessing!<br>They're stronger than the original buffs!<br><br>Oh, and the rules for vitality and extra money are the same as before.<br><br>Cultivators above <span class='realm_cloudy'>Nimbus Rank: Stage 4</span> need not apply;<br>this mid-grade statue can't carry that strong a projection.<br>Also, a reminder — the blessing changes every 22.5h.<br>Given <span class='realm_cloudy'>Nimbus Rank</span>'s 4.8h/s time flow,<br>better to consult a table than check the blessing on the spot.",
                unlocks: {
                    textlines: [{dialogue: "烈日神像", lines: ["lr2"]},{dialogue: "烈日神像", lines: ["lr3"]}],
                },
                
                locks_lines: ["lr1"],
            }), 
            "lr2": new Textline({ 
                is_unlocked: false,
                name: "(Check current blessing and cost information)",
                text: "",
                unlocks: {
                    spec: "LR-check",
                },
            }), 
            "lr3": new Textline({ 
                is_unlocked: false,
                name: "(Offer Dao Coins to receive the blessing)",
                text: "",
                unlocks: {
                    spec: "LR-sacrifice",
                },
            }), 
        }
    });

    dialogues["末世天骄"] = new Dialogue({
        name: "Apocalypse Prodigy",
        starting_text: "Talk to the mass of resentment",
        textlines: {
            "hx8": new Textline({ 
                is_unlocked: true,
                name: "(Approach)",
                text: "[???] I refuse to accept this! I refuse!<br>I, a genius, brilliant all my life, fought through hardship to survive the Genius War,<br>only to fall in a mere trial mission!<br><br>[Neko] Such intense resentment, and from someone I've never seen before.<br>Could it be... the owner of this ship?<br>That is, the visitor from beyond the sky<br>who fell here.",
                unlocks: {
                    textlines: [{dialogue: "末世天骄", lines: ["hx9"]}],
                },
                
                locks_lines: ["hx8"],
            }), 
            "hx9": new Textline({ 
                is_unlocked: false,
                name: "I see...",
                text: "[Neko] Back when I was sealed inside the ship,<br>his resentment had already attached itself deep in my heart,<br>and for so long I never noticed...<br>[???] Kill, kill you all!<br>Daring to block a genius's path to power,<br>you're nothing but a bunch of ignorant natives —<br>[Neko] It seems... you really can't accept it.<br>Those you call natives,<br>the Xuelo Continent residents who died by your hand —<br>didn't they want to live too?<br>Slaughtering low-rank Xuelo residents at will<br>brought you no benefit at all;<br>it was just a way to vent your rage!<br><br>Do you think a true genius, facing their end...",
                unlocks: {
                    textlines: [{dialogue: "末世天骄", lines: ["hx10"]}],
                },
                locks_lines: ["hx9"],
            }), 
            "hx10": new Textline({ 
                is_unlocked: false,
                name: "would be as hysterical as you?",
                text: "[???] You... I...<br>Aaaaargh —<br><br>The visitor from beyond the sky suddenly fell silent,<br>as if he had completely calmed down.<br>His gaze became still as water.<br>Then, all at once, the resentment drifting around began to boil,<br>and the visitor let out a wild laugh.<br><br>[???] Hehehe...<br>When the reactor melted down,<br>did you ever wonder why the radiation was so brief?<br>That was all thanks to — me, the genius!<br>This genius has already recovered to half a step from Nimbus Rank!",
                unlocks: {
                    locations: ["幻境核心 - 歧路"],
                },
                locks_lines: ["hx10"],
            }), 
        }
    });

    dialogues["十连扭蛋机"] = new Dialogue({
        name: "Ten-Pull Gacha Machine",
        starting_text: "Use the [Ten-Pull Gacha Machine]",
        textlines: {
            "nd1": new Textline({ 
                is_unlocked: false,
                name: "About the gacha machine",
                text: "Pull using <img src='image/item/inherit_pink.png'>Inheritance Crystal: Pink!<br>10 per pull, 90 for a ten-pull!",
                unlocks: {
                    textlines: [{dialogue: "十连扭蛋机", lines: ["nd2"]},{dialogue: "十连扭蛋机", lines: ["nd3"]}],
                },
                
                locks_lines: ["nd1"],
            }), 
            "nd2": new Textline({ 
                is_unlocked: false,
                name: "Single pull (10 x <img src='image/item/inherit_pink.png'>Inheritance Crystal: Pink)",
                text: "",
                unlocks: {
                    spec:"gacha-1",
                },
            }), 
            "nd3": new Textline({ 
                is_unlocked: false,
                name: "Ten-pull (90 x <img src='image/item/inherit_pink.png'>Inheritance Crystal: Pink)",
                text: "",
                unlocks: {
                    spec:"gacha-10",
                    textlines: [{dialogue: "十连扭蛋机", lines: ["nd4"]}],
                },
            }), 
            "nd4": new Textline({ 
                is_unlocked: false,
                name: "Fifty-pull (450 x <img src='image/item/inherit_pink.png'>Inheritance Crystal: Pink)",
                text: "",
                unlocks: {
                    spec:"gacha-50",
                },
            }), 
            
            "by": new Textline({ 
                is_unlocked: true,
                name: "Convert <img src='image/item/iceland_heart.png'>Glacial Plain Heart (must be in the equipment slot)",
                text: "",
                unlocks: {
                    spec:"byzx",
                },
            }),
        }
    });


    dialogues["心魔之主"] = new Dialogue({
        name: "Lord of Inner Demons",
        starting_text: "Talk to Big Bro Feng (?)",
        textlines: {
            "xm1": new Textline({ 
                is_unlocked: false,
                name: "Feng... Big Bro Feng.",
                text: "[Feng] Koko.<br>I'm surprised you fought through four illusion layers<br>to get here. But this is where it ends.",
                unlocks: {
                    textlines: [{dialogue: "心魔之主", lines: ["xm2"]}],
                },
                locks_lines: ["xm1"],
            }), 
            "xm2": new Textline({ 
                is_unlocked: false,
                name: "Eh...?",
                text: "[Feng] The truth is, all these years<br>I've watched you push through<br>the glacial plain, the Water Prison, four illusion layers.<br>I've been watching you grow the whole time.<br><br>I even hid inside that gacha machine —<br>though short of a one-in-a-trillion miracle,<br>you'd never have found me.<br><br>Your performance satisfies me,<br>so you're qualified —<br>to become my soul servant.",
                unlocks: {
                    textlines: [{dialogue: "心魔之主", lines: ["xm3"]}],
                },
                locks_lines: ["xm2"],
            }), 
            "xm3": new Textline({ 
                is_unlocked: false,
                name: "I... I don't understand.",
                text: "[Feng] I've said this much and you still don't get it?<br>The truth is, I noticed you long ago —<br>noticed a certain quality in you.<br>I knew every plan of the Baijia and the Thirteen Axes,<br>so I used them to get close to you,<br>and silently left a deep brand on your heart.",
                unlocks: {
                    textlines: [{dialogue: "心魔之主", lines: ["xm4"]}],
                },
                locks_lines: ["xm3"],
            }), 
            "xm4": new Textline({ 
                is_unlocked: false,
                name: "A brand? All I remember is... <span class='coin coin_moneySp'>1.21Δ</span>.",
                text: "[Feng] ...Stop thinking about money at a time like this!<br>Come, open your body and mind.<br>I'll shelter you, make you strong,<br>and you'll follow me across the vast worlds.<br><br>[Neko] And if I say no?<br>You're lying — in every sense.<br>When Big Bro Feng was with me,<br>I peeked at his stat panel.<br>You think someone at your level<br>could imitate the pressure of <b><span style='color:#00fa9a'>Hundred-Line Style</span> <span style='color:#edec9f'>Golden Void Law</span><br><span style='color:lime'>4.489Qi</span> <span style='color:red'>167.24Q</span> <span style='color:blue'>86.49Q</span></b>?",
                unlocks: {
                    textlines: [{dialogue: "心魔之主", lines: ["xm5"]}],
                },
                locks_lines: ["xm4"],
            }), 
            "xm5": new Textline({ 
                is_unlocked: false,
                name: "Isn't that excuse a little childish?",
                text: "(Feng's form changes into ???)<br>[???] Utter nonsense!<br>You make up stats and don't even fake agility?!<br>This is the RPG plane!<br><br><span class='message_sayuki'>[Sayuki] Eh eh?<br>I just remembered something I'd forgotten.<br>I owe you thanks for that.</span><br>[Neko] Even having met the City Lord and Senior Zuo'a —<br>two Domain Rank masters — standing before them<br>never felt as unfathomable as Feng...<br>So, having seen what a true powerhouse looks like...",
                unlocks: {
                    textlines: [{dialogue: "心魔之主", lines: ["xm6"]}],
                },
                locks_lines: ["xm5"],
            }), 
            "xm6": new Textline({ 
                is_unlocked: false,
                name: "Words like that alone won't shake me.",
                text: "[Lord of Inner Demons] You've earned the right to know who I am.<br>I am — the Lord of Inner Demons.<br>The source of everything you fear<br>and every negative emotion in your heart.",
                unlocks: {
                    textlines: [{dialogue: "心魔之主", lines: ["xm7"]}],
                },
                locks_lines: ["xm6"],
            }), 
            "xm7": new Textline({ 
                is_unlocked: false,
                name: "Everything I fear? Have you looked at your own skill bar?",
                text: "[Lord of Inner Demons] You've earned the right to know who I am.<br>I am — the Lord of Inner Demons.<br>The source of everything you fear<br>and every negative emotion in your heart.<br>Skills? Fine, look!<br>",
                unlocks: {
                    spec:"heartdemon-lord",
                    locations:["幻境核心 - IV"]
                },
                locks_lines: ["xm7"],
            }), 
        }
    });


    dialogues["溪月(核心)"] = new Dialogue({
        name: "Xiyue (Core)",
        starting_text: "Talk to the pink-haired girl [Xiyue]",
        textlines: {
            "hx11_1": new Textline({ 
                is_unlocked: true,
                name: "(Open eyes)",
                text: "[Xiyue] Welcome to the deepest layer of the Illusion Core —<br>Illusion Core: Reality.<br>Stop looking around, you won't find me.<br>I'm deep in your sea of consciousness, sending messages by thought.",
                unlocks: {
                    textlines: [{dialogue: "溪月(核心)", lines: ["hx12"]}],
                },
                locks_lines: ["hx11_1"],
            }), 
            "hx12": new Textline({ 
                is_unlocked: false,
                name: "Miss Xiyue, why are you here?",
                text: "[Neko] And what is this illusion really about?<br>Senior Zuo'a, he —<br><br>[Xiyue] Don't call that guy 'senior' in here. Pah.<br>Right now he's busy trying to erase the soul mark on you,<br>too distracted to notice, which gave me the chance to slip in.",
                unlocks: {
                    textlines: [{dialogue: "溪月(核心)", lines: ["hx13"]}],
                },
                locks_lines: ["hx12"],
            }), 
            "hx13": new Textline({ 
                is_unlocked: false,
                name: "Eh?",
                text: "[Xiyue] Long story short —<br>well, it doesn't matter, thought transmission is fast.<br>It won't take much of your time.<br>First, remember the \"Power Ranking\" in the Water Prison?<br>Mm, I mean the vacant first place.",
                unlocks: {
                    textlines: [{dialogue: "溪月(核心)", lines: ["hx14"]}],
                },
                locks_lines: ["hx13"],
            }), 
            "hx14": new Textline({ 
                is_unlocked: false,
                name: "Why bring that up all of a sudden?",
                text: "[Neko] The intel said that for hundreds of years,<br>Lanqi has kept first place empty.<br><br>[Xiyue] Hehe... of course it's empty,<br>because number one already left the Water Prison<br>and went over to the barrier's master.<br>'Went over' — really just lurking at Zuo'a's side,<br>and happening to be of some use to him,<br>so he took her in —<br>and she learned a great deal of intel along the way.",
                unlocks: {
                    textlines: [{dialogue: "溪月(核心)", lines: ["hx15"]}],
                },
                locks_lines: ["hx14"],
            }), 
            "hx15": new Textline({ 
                is_unlocked: false,
                name: "The former number one on the Power Ranking... was you?!",
                text: "[Xiyue] Clever, clever! As expected,<br>talking with a clever child is a pleasure.<br>Little Lan is just as clever as you,<br>but sadly she doesn't like talking.<br>Back in the Water Prison, she... ah, I'm rambling.",
                unlocks: {
                    textlines: [{dialogue: "溪月(核心)", lines: ["hx16"]}],
                },
                locks_lines: ["hx15"],
            }), 
            "hx16": new Textline({ 
                is_unlocked: false,
                name: "You mean [Lanqi]?",
                text: "[Neko] ...When I left the Water Prison,<br>she said some things I only half understood.<br><br>[Xiyue] Ah, I can roughly guess what she said.<br>She didn't speak plainly<br>not because she didn't want to, but because she couldn't.<br>The whole Water Prison is under [Zuo'a]'s surveillance.<br>Pass along a message just a little carelessly,<br>draw his suspicion, and you could be erased!",
                unlocks: {
                    textlines: [{dialogue: "溪月(核心)", lines: ["hx17"]}],
                },
                locks_lines: ["hx16"],
            }), 
            "hx17": new Textline({ 
                is_unlocked: false,
                name: "What kind of person is Zuo'a, really?",
                text: "[Xiyue] He's a <span class='realm_domain'>Domain Rank</span> powerhouse,<br>and an absolute, thoroughgoing... madman.<br><br>[Neko] Th-then those precious inheritances...<br>don't tell me?<br><br>[Xiyue] All a sham. He appears to screen geniuses to receive his inheritance,<br>but in reality he just wants to use them to rebuild his body,<br>to forge a \"vessel\" that can hold his soul!<br>As far as I know, the powerhouses of the Water Prison,<br>no matter how they leave that place,<br>almost without exception<br>end up as part of that vessel.",
                unlocks: {
                    textlines: [{dialogue: "溪月(核心)", lines: ["hx18"]}],
                },
                locks_lines: ["hx17"],
            }), 
            "hx18": new Textline({ 
                is_unlocked: false,
                name: "What —!",
                text: "[Xiyue] The minimum requirement for a vessel is...<br>a living body, with high Sky Rank strength.<br>If you have a Stage 3 Domain,<br>you've unquestionably met it.<br>The Water Prison's exit summons powerhouses out<br>once they meet the standard —<br>and then, naturally, they become part of the vessel.",
                unlocks: {
                    textlines: [{dialogue: "溪月(核心)", lines: ["hx19"]}],
                },
                locks_lines: ["hx18"],
            }), 
            "hx19": new Textline({ 
                is_unlocked: false,
                name: "Then what was that about killing all the other powerhouses?",
                text: "[Xiyue] Just a pretext...<br>Life-and-death struggle is always the catalyst for the strong.<br>Nobody in history has ever killed every powerhouse in the Water Prison.<br>Because... outsiders who stumble into this Secret Realm<br>keep pouring in almost endlessly.<br>The only fates for those powerhouses are to be killed by someone,<br>to die of old age, or to become the vessel.",
                unlocks: {
                    textlines: [{dialogue: "溪月(核心)", lines: ["hx20"]}],
                },
                locks_lines: ["hx19"],
            }), 
            "hx20": new Textline({ 
                is_unlocked: false,
                name: "\"Life-and-death struggle is always the catalyst for the strong\"",
                text: "[Neko] \"As long as one powerhouse is born from ten thousand weaklings,<br>the value to the race far exceeds those ten thousand\"<br>...Fine, I understand.<br>When does your HP bar light up?<br>(Red and blue light flickers in her eyes)<br><br>[Xiyue] Hehe...<br>A reaction like that from a little girl<br>means she's met too many madmen.<br>Sadly Sayuki didn't give me any stats,<br>so all I can do is hand over everything I know!",
                unlocks: {
                    textlines: [{dialogue: "溪月(核心)", lines: ["hx21"]}],
                },
                locks_lines: ["hx20"],
            }), 
            "hx21": new Textline({ 
                is_unlocked: false,
                name: "(Receive intel pt1)",
                text: "Zuo'a, an insignificant nobody.<br>In the Hunyuan Sect, teeming with experts,<br>his mediocre talent went unnoticed;<br>his fellow disciples shunned him and looked down on him.<br>In this world of competition and slaughter,<br>the weak can only ever live at the very bottom.<br>He worked desperately, but his cultivation talent was too poor to change anything.<br>Until one day, he met a genius fellow disciple.<br>The two hit it off, and in their good cheer had a few too many drinks.<br>From that drunken night, one of them never woke again.",
                unlocks: {
                    textlines: [{dialogue: "溪月(核心)", lines: ["hx22"]}],
                },
                locks_lines: ["hx21"],
            }), 
            "hx22": new Textline({ 
                is_unlocked: false,
                name: "(Receive intel pt2)",
                text: "In everyone's eyes, he had given up his ambitions,<br>spending his days drinking and carousing with friends.<br>Over time, he even made a few influential connections.<br>He could finally hold his head up before his fellow disciples,<br>but what no one expected<br>was that this was only the first step of a vast plan.<br>That day, the sect's leaders found the corpse<br>of his fellow disciple in the Wild Beast Forest.<br>Beside the corpse were several Sky Rank ferocious beasts.<br>He had clearly just been through a fierce battle,<br>drenched in blood, his face smeared with dirt and dust.",
                unlocks: {
                    textlines: [{dialogue: "溪月(核心)", lines: ["hx23"]}],
                },
                locks_lines: ["hx22"],
            }), 
            "hx23": new Textline({ 
                is_unlocked: false,
                name: "(Receive intel pt3)",
                text: "After that, Zuo'a grew withdrawn and gloomy;<br>his fellow disciple's death seemed to have hit him hard.<br>He stopped drinking and instead shut himself in the training hall all day.<br>From then on, his cultivation began to climb rapidly.<br>Everyone assumed the shock had awakened something in him,<br>and began to see him in a new light.<br>The sect master was overjoyed,<br>and on the spot named him young sect master —<br>the future successor of the Hunyuan Sect!<br><br>[Xiyue] Mm. That's how it went.<br>It should have been an inspiring story...<br>but, little girl, did you spot what's suspicious?",
                unlocks: {
                    textlines: [{dialogue: "溪月(核心)", lines: ["hx24"]}],
                },
                locks_lines: ["hx23"],
            }), 
            "hx24": new Textline({ 
                is_unlocked: false,
                name: "The fellow disciple's death is a bit odd —",
                text: "[Xiyue] Correct! Later,<br>the Hunyuan Sect's master also noticed something was off,<br>and ordered a thorough investigation —<br>",
                unlocks: {
                    textlines: [{dialogue: "溪月(核心)", lines: ["hx25"]}],
                },
                locks_lines: ["hx24"],
            }), 
            "hx25": new Textline({ 
                is_unlocked: false,
                name: "(Receive intel pt4)",
                text: "Once Zuo'a held high office,<br>his temperament grew even more unrestrained and unconcealed.<br>Unworthy of his position, he made more and more enemies.<br>Paper can't wrap fire —<br>the death of that fellow disciple was brought up again,<br>and many sect members confronted Zuo'a,<br>picking apart every oddity of the affair.<br>The sect master was a Domain Rank powerhouse;<br>illusions ordinary people couldn't see through<br>had nowhere to hide from his eyes,<br>and clues were soon gathered one after another.",
                unlocks: {
                    textlines: [{dialogue: "溪月(核心)", lines: ["hx26"]}],
                },
                locks_lines: ["hx25"],
            }), 
            "hx26": new Textline({ 
                is_unlocked: false,
                name: "(Receive intel pt5)",
                text: "When the truth came out and everyone realized<br>that the fellow disciple had indeed been killed by Zuo'a,<br>and his innate primordial spirit body possessed by Zuo'a,<br>it was already too late. To their horror, they found<br>that Zuo'a had used his position as young sect master<br>to spend years cultivating inside the sect's greatest treasure —<br>the [Hall of Time].<br>His cultivation had long surpassed what he showed by who knows how much!<br>When the false mask was torn away,<br>in little more than a century,<br>he had already reached Nimbus Rank Stage 9!",
                unlocks: {
                    textlines: [{dialogue: "溪月(核心)", lines: ["hx27"]}],
                },
                locks_lines: ["hx26"],
            }), 
            "hx27": new Textline({ 
                is_unlocked: false,
                name: "(Receive intel pt6)",
                text: "Zuo'a swept a cold gaze over the crowd,<br>and, ruthless as he was, struck first.<br>The sect master moved to stop him, only to find the Zuo'a before him was a phantom.<br>His true body, under the authority of young sect master,<br>had already passed unhindered from one mountain gate to the next,<br>carrying out a one-sided massacre.<br>He was Nimbus Rank Stage 9, with a possessed innate primordial spirit body;<br>the Earth and Sky Rank disciples,<br>even the Nimbus Rank sect elders, could not fight back at all!",
                unlocks: {
                    textlines: [{dialogue: "溪月(核心)", lines: ["hx28"]}],
                },
                locks_lines: ["hx27"],
            }), 
            "hx28": new Textline({ 
                is_unlocked: false,
                name: "(Receive intel pt7)",
                text: "In the whole Hunyuan Sect, only the sect master could still fight him.<br>And that sect master, without a moment's hesitation,<br>staked his own life in a desperate battle with Zuo'a.<br>Even so, the Hunyuan Sect's losses were catastrophic.<br>The scene, witnessed by the other sects,<br>caused an uproar.<br>The sect master died. Zuo'a's body was destroyed,<br>but he broke through in the midst of battle and his soul fled far away.<br>He took the sect's treasure, the [Hall of Time], with him.<br>Soon after, the Hunyuan Sect was carved up by many factions. The once-invincible greatest power...",
                unlocks: {
                    textlines: [{dialogue: "溪月(核心)", lines: ["hx29"]}],
                },
                locks_lines: ["hx28"],
            }), 
            "hx29": new Textline({ 
                is_unlocked: false,
                name: "vanished into the long river of Yangang Territory's history.",
                text: "[Xiyue] You already know the rest,<br>so I won't repeat it.<br>That's how it was.<br>The Hunyuan sect master's family was once a prestigious house of Yangang Territory.<br>After that earth-shaking war,<br>the Hunyuan Sect vanished, the family lost countless members, and the house fell into decline.<br>That sect master was a man worthy of respect;<br>single-handedly he saved the entire sect from being wiped out.<br>And also, he was —<br>my ancestor. Mine, and Lanqi's.",
                unlocks: {
                    textlines: [{dialogue: "溪月(核心)", lines: ["hx30"]}],
                },
                locks_lines: ["hx29"],
            }), 
            "hx30": new Textline({ 
                is_unlocked: false,
                name: "This really doesn't feel good.",
                text: "[Neko] Listening to someone recount something so heavy about themselves so lightly.<br><br>[Xiyue] Ah, it's fine.<br>I'm happy now, because I've seen hope —<br>hope of rewriting this fate.<br>Our family endured in silence for generations,<br>a full ten eras,<br>gathering intel the whole time,<br>tracking down Zuo'a's whereabouts<br>and everything he's done over the years.",
                unlocks: {
                    textlines: [{dialogue: "溪月(核心)", lines: ["hx31"]}],
                },
                locks_lines: ["hx30"],
            }), 
            "hx31": new Textline({ 
                is_unlocked: false,
                name: "…",
                text: "[Xiyue] Under those conditions, Lanqi and I<br>quietly disguised ourselves as ordinary adventurers,<br>lurked at Zuo'a's side, and...<br>waited for our chance!<br>What Lanqi did in the Water Prison<br>wasn't to protect her own position;<br>it was to protect the powerhouses there,<br>to keep them from growing stronger<br>and meeting the \"vessel\" standard.<br><br>[Neko] Phew... what a twisted story...<br>Were you waiting?",
                unlocks: {
                    textlines: [{dialogue: "溪月(核心)", lines: ["hx32"]}],
                },
                locks_lines: ["hx31"],
            }), 
            "hx32": new Textline({ 
                is_unlocked: false,
                name: "Waiting for a power that could turn the tide to appear?",
                text: "[Xiyue] Yes. I know our plan is dangerous,<br>with no guarantee of success at all.<br>Because the Zuo'a of now<br>is close to recovering his former state.<br>This is the only chance to kill him,<br>so we have to stake everything.<br>Even if it costs us, so be it.<br>Lanqi and I — our family has waited ten eras.<br>We don't want to keep waiting.",
                unlocks: {
                    textlines: [{dialogue: "溪月(核心)", lines: ["hx33"]}],
                },
                locks_lines: ["hx32"],
            }), 
            "hx33": new Textline({ 
                is_unlocked: false,
                name: "I believe you.",
                text: "[Neko] So Zuo'a hoarded that many treasures...<br>that explains it.<br>Wait, then isn't my sister in danger?!<br><br>[Xiyue] Mm-mm, don't worry.<br>Your sister's in the storage chest, isn't she?<br>As long as we destroy this place<br>before Zuo'a ransacks it and drags her out,<br>she'll be fine.<br>I'll do everything I can to see your sister leaves unharmed.",
                unlocks: {
                    textlines: [{dialogue: "溪月(核心)", lines: ["hx34"]}],
                },
                locks_lines: ["hx33"],
            }), 
            "hx34": new Textline({ 
                is_unlocked: false,
                name: "I'll give it everything too!",
                text: "[Neko] Then, Miss Xiyue, here's to a good partnership.<br><br>[Xiyue] ...Thank you. I'm counting on you...<br><br>",
                unlocks: {
                    locations:["幻境核心 - 6"],
                },
                locks_lines: ["hx34"],
            }), 
            "hx35": new Textline({ 
                is_unlocked: false,
                name: "Then, open the final battleground for me!",
                text: "[Xiyue] Mm... it's ready!<br><br>",
                unlocks: {
                    locations:["幻境核心·决战"],
                    spec:'save',
                },
                locks_lines: ["hx35"],
            }), 
        }
    })
    dialogues["草场"] = new Dialogue({
        name: "Grassland",
        starting_text: "Go harvest [Silent Fern]",
        textlines: {
            "grass": new Textline({ 
                is_unlocked: true,
                name: "...",
                text: "...",
                unlocks: {
                    spec:"grass-field",
                },
                
            }),
        }
    });
    dialogues["左阿(决战)"] = new Dialogue({
        name: "Zuo'a (Final Battle)",
        starting_text: "Talk to \"Senior\" Zuo'a",
        textlines: {
            "za1": new Textline({ 
                is_unlocked: true,
                name: "At last — the source of power sustaining the entire illusion...",
                text: "[Zuo'a] Congratulations, little girl.<br>Making it here alive<br>means you're qualified to receive my — [Zuo'a]'s — inheritance.<br>Except —",
                unlocks: {
                    textlines: [{dialogue: "左阿(决战)", lines: ["za2"]}],
                },
                locks_lines: ["za1"],
            }),
            "za2": new Textline({ 
                is_unlocked: false,
                name: "No need to reveal the answer; I already know.",
                text: "[Neko] You've told a lot of lies.<br>Truly disappointing, Senior Zuo'a.<br><br>[Zuo'a] Ahahahahaha, very good, interesting, interesting.<br>It seems things have taken<br>a slightly unexpected turn.",
                unlocks: {
                    textlines: [{dialogue: "左阿(决战)", lines: ["za3"]}],
                },
                locks_lines: ["za2"],
            }),
            "za3": new Textline({ 
                is_unlocked: false,
                name: "Your time has passed, senior.",
                text: "[Neko] There's no need to keep stirring up trouble here.<br><br>[Zuo'a] Enough nonsense. My hundred-thousand-year plan<br>is one step from completion;<br>as if I'd give it up over one little girl.<br>You know how much I hate that undying old sect master.<br>If not for him,<br>would a titan like me have been stuck in this barrier for a hundred thousand years?",
                unlocks: {
                    textlines: [{dialogue: "左阿(决战)", lines: ["za4"]}],
                },
                locks_lines: ["za3"],
            }),
            "za4": new Textline({ 
                is_unlocked: false,
                name: "After everything you've done, have you still not realized how utterly ordinary you are?",
                text: "[Neko] Your path was wrong from the very start.<br>Over a hundred thousand years, more than 230,000 adventurers<br>wandered into this place.<br>The 200,000 of them below Sky Rank<br>became nourishment for the barrier the instant they stepped in.<br>You never even thought to loot the bodies —<br>if one of them carried a treasure like a B6 laser gun,<br>you'd just let it go?",
                unlocks: {
                    textlines: [{dialogue: "左阿(决战)", lines: ["za5"]}],
                },
                locks_lines: ["za4"],
            }),
            "za5": new Textline({ 
                is_unlocked: false,
                name: "Thirty thousand Sky Ranks, under the Water Prison's time acceleration,",
                text: "[Neko] lived through five hundred thousand years and countless massacres,<br>leaving only the few hundred alive today.<br>Considering Sky Rank lifespans are only ten thousand years...<br>the fact that hundreds still survive<br>means the vast majority died of natural causes!<br>The Water Prison should be full of mutual suspicion,<br>not as orderly as it is now!",
                unlocks: {
                    textlines: [{dialogue: "左阿(决战)", lines: ["za6"]}],
                },
                locks_lines: ["za5"],
            }),
            "za6": new Textline({ 
                is_unlocked: false,
                name: "And then there are the twenty-five Nimbus Rank powerhouses,",
                text: "[Neko] good enough to serve as vessels,<br>whom you killed outright without mercy...<br>is that your excuse for leaving their souls lying around?<br><br>[Zuo'a] Little girl,<br>I don't know where you found the nerve<br>to lecture me about how badly I run my Water Prison.<br>But your cultivation is still far too green for me.",
                unlocks: {
                    textlines: [{dialogue: "左阿(决战)", lines: ["za7"]}],
                },
                locks_lines: ["za6"],
            }),
            "za7": new Textline({ 
                is_unlocked: false,
                name: "[Zuo'a] Is this some kind of joke?",
                text: "[Neko] Time's up.<br>Time to transform, Domain power.",
                unlocks: {
                    textlines: [{dialogue: "左阿(决战)", lines: ["za8"]}],
                    spec:"realm-IV",
                },
                locks_lines: ["za7"],
            }),
            "za8": new Textline({ 
                is_unlocked: false,
                name: "(Warning ⚠️: fast return will be disabled after triggering this scene)",
                text: "[Zuo'a] Is that all your trump card amounts to?<br>[Neko] It's far from over.<br><br>[Act III BOSS battle has begun!]",
                unlocks: {
                    textlines: [{dialogue: "决战木牌", lines: ["S31"]},{dialogue: "决战木牌", lines: ["S32"]},{dialogue: "决战木牌", lines: ["S33"]}],
                    spec:"S3-start",
                },
                locks_lines: ["za8"],
            }),
        }
    });
    dialogues["决战木牌"] = new Dialogue({
        name: "Final Battle Signboard",
        starting_text: "View the boss battle rules",
        textlines: {
            "S31": new Textline({ 
                is_unlocked: false,
                name: "[Heart Spirits] and [Soul Power]",
                text: "Each [Heart Spirit] defeated<br>grants 1 point of [Soul Power]!<br>At 5 and 10 Soul Power, your max HP increases by 20%!<br>At 15 and 20, your ATK/DEF/AGI rise by 100M!<br>At 25, the seal is complete!<br>Once the seal is complete,<br>Zuo'a's power is weakened by <span style='color:aqua'>10081</span>x and the final battle with Neko begins!",
                unlocks: {
                },
                
            }),
            "S32": new Textline({ 
                is_unlocked: false,
                name: "Dashboard display",
                text: "<img src='image/item/violet_ingot.png'>Soul Crystal Ingots represent [Soul Power]!<br><img src='image/boss/B3706.png'><img src='image/boss/B3707.png'><img src='image/boss/B3708.png'>Heart Spirits represent how many of that Heart Spirit remain on the field!",
                unlocks: {
                },
                
            }),
            "S33": new Textline({ 
                is_unlocked: false,
                name: "Why can't I go back",
                text: "Once the final battle starts, there's no turning back!<br>Load a save... I believe I warned you outside.<br>Of course, you can still go back once it's over.",
                unlocks: {
                },
                
            }),
        }
    });

    dialogues["冰溪月"] = new Dialogue({
        name: "Bing Xiyue",
        starting_text: "Talk to Xiyue",
        textlines: {
            "bx1": new Textline({ 
                is_unlocked: true,
                name: "(The residual water-element barrier still flows through the Water Prison,)",
                text: "but that faint sense of suffocation has dispersed.<br>A dozen or so figures stand gathered on a platform bathed in daylight.<br><br>[Neko] Eh, eh?<br>So everyone here<br>is from Miss Xiyue's... family?<br><br>[Bing Xiyue] Xiyue was only a temporary name;<br>let me introduce myself again.<br>I am <span style='color:aqua'>Bing Xiyue</span>, of the Bing Clan.<br>",
                unlocks: {
                    spec:"P3-1",
                    textlines: [{dialogue: "冰溪月", lines: ["bx2"]}],
                },
                
                locks_lines: ["bx1"],
            }),
            "bx2": new Textline({ 
                is_unlocked: false,
                name: "Then... what about the others?",
                text: "[Bing Xiyue] Hehe, sorry for only telling you now.<br>But there was no other way.<br>Also, of the twenty on the Power Ranking — not all,<br>but most were placed there by us one after another,<br>lying in wait like death-sworn agents.<br>",
                unlocks: {
                    spec:"P3-2",
                    textlines: [{dialogue: "冰溪月", lines: ["bx3"]}],
                },
                
                locks_lines: ["bx2"],
            }),
            "bx3": new Textline({ 
                is_unlocked: false,
                name: "So that's how it was. No wonder...",
                text: "[Nanami] so many Domain-wielding powerhouses gathered here.<br><br>[Bing Xiyue] Mm, actually it's more than that.<br>To obtain information about the Water Prison,<br>the family paid with the lives<br>of several Nimbus Rank seniors, one after another.",
                unlocks: {
                    textlines: [{dialogue: "冰溪月", lines: ["bx4"]}],
                },
                
                locks_lines: ["bx3"],
            }),
            "bx4": new Textline({ 
                is_unlocked: false,
                name: "Those souls...",
                text: "",
                unlocks: {
                    textlines: [{dialogue: "冰溪月", lines: ["bx5"]}],
                    spec:"P3-3",
                },
                
                locks_lines: ["bx4"],
            }),
            "bx5": new Textline({ 
                is_unlocked: false,
                name: "So all of this was part of your calculations?",
                text: "[Nanami] Th-then Koko and I —<br><br>Nanami suddenly grew agitated;<br>Neko may have broken through in the end,<br>but she never wanted her little sister dragged into something like this.<br><br>[Neko] Sis, it's okay.<br>After going through all this,<br>I feel terrifyingly strong now.<br>Once we're home, it's time to have a talk with Dad...<br>The seat of clan head has always gone to the capable!",
                unlocks: {
                    textlines: [{dialogue: "冰溪月", lines: ["bx6"]}],
                },
                
                locks_lines: ["bx5"],
            }),
            "bx6": new Textline({ 
                is_unlocked: false,
                name: "…",
                text: "",
                unlocks: {
                    spec:"P3-4",
                    textlines: [{dialogue: "冰溪月", lines: ["bx7"]}],
                },
                
                locks_lines: ["bx6"],
            }),
            "bx7": new Textline({ 
                is_unlocked: false,
                name: "Mm, leaving already?...",
                text: "[Nanami] There's still a lot I want to ask,<br>but what you carry is heavier than I imagined.<br>Get some good rest.<br><br>[Mo'er] Let's go; the clan elders have been waiting impatiently.<br>Then, this is goodbye. Take care.<br>",
                unlocks: {
                    textlines: [{dialogue: "冰溪月", lines: ["bx8"]}],
                },
                locks_lines: ["bx7"],
            }),
            "bx8": new Textline({ 
                is_unlocked: false,
                name: "Sis... what you said just now,",
                text: "[Neko] about seeing something in the illusion you'd never seen before —<br>is it true?<br><br>[Nanami] Yes, that scene... was really strange.<br>Koko, you said the illusions you fought through were built from your memories,<br>creating things that contradict your beliefs to drag you into darkness.<br>But I don't remember anything in my memory —<br>or ever having been to that place in the illusion.<br>A sky of interwoven golden radiance,<br>giant beasts tumbling and dancing among the clouds, celestial music echoing to the heavens.",
                unlocks: {
                    textlines: [{dialogue: "冰溪月", lines: ["bx9"]}],
                },
                locks_lines: ["bx8"],
            }),
            "bx9": new Textline({ 
                is_unlocked: false,
                name: "Wow, that sounds amazing...",
                text: "[Nanami] But...<br>whenever I tried to see those beast shapes clearly, or hear the music clearly,<br>my consciousness seemed to reel as if struck.",
                unlocks: {
                    textlines: [{dialogue: "冰溪月", lines: ["bx10"]}],
                },
                locks_lines: ["bx9"],
            }),
            "bx10": new Textline({ 
                is_unlocked: false,
                name: "Everyone's illusion is different... then?",
                text: "[Neko] So sis, do you have any clue?<br><br>[Nanami] No idea, but once we're back with the clan<br>I want to go into seclusion for a while.<br>It was bizarre beyond words, but when I came out,<br>I felt full of insights.<br>As if that place hid some opportunity for a breakthrough.<br>",
                unlocks: {
                    textlines: [{dialogue: "冰溪月", lines: ["bx11"]}],
                },
                locks_lines: ["bx10"],
            }),
            "bx11": new Textline({ 
                is_unlocked: false,
                name: "That's great, sis. Let's hurry home,",
                text: "[Neko] and tell Big Bro Feng and Father the news...<br><br>[Nanami] Phew — okay. Our business here is done; time to leave.<br>",
                unlocks: {
                    locations:["纳家宝库"],
                },
                locks_lines: ["bx11"],
            }),
        }
    });

    dialogues["纳布(宝库)"] = new Dialogue({
        name: "Nabu (Treasury)",
        starting_text: "Talk to Nabu (Treasury)",
        textlines: {
            "bk1": new Textline({ 
                is_unlocked: true,
                name: "I'm back~",
                text: "[Nabu] Koko! Nana! Are you alright?<br>I've been searching for you for",
                unlocks: {
                    spec:"age-check",
                    textlines: [{dialogue: "纳布(宝库)", lines: ["bk2"]}],
                },
                locks_lines: ["bk1"],
            }),
            "bk2": new Textline({ 
                is_unlocked: false,
                name: "I'm fine.",
                text: "[Neko] Father, you said it yourself:<br>opportunity is only found in dangerous places.<br>The strength I have now<br>is exactly thanks to this string of life-and-death crises.<br><br>[Nabu] <span class='realm_sky'>Sky Rank: Pinnacle</span>? Domain Stage 4?!!<br>As expected of my, Nabu's... say it,<br>what did you come back to the clan for this time?",
                unlocks: {
                    textlines: [{dialogue: "纳布(宝库)", lines: ["bk3"]}],
                },
                locks_lines: ["bk2"],
            }),
            "bk3": new Textline({ 
                is_unlocked: false,
                name: "I heard... there's a Yangang Territory Hunting Tournament lately?",
                text: "[Nabu] Yes... anyone below <span class='realm_cloudy'>Nimbus Rank</span> can enter.<br>After the beast tide of Era 31698, Year 1372,<br>the Wild Beasts across all of Yangang Territory went up a tier.<br>The tournament rewards are considerable,<br>and Nimbus Rank beast materials can be brought home.",
                unlocks: {
                    textlines: [{dialogue: "纳布(宝库)", lines: ["bk4"]}],
                },
                locks_lines: ["bk3"],
            }),
            "bk4": new Textline({ 
                is_unlocked: false,
                name: "Really! Then I'm going!",
                text: "[Nabu] Koko can go; Nana, forget it...<br>Oh, and I was going to pass the Nayaka Clan's treasure [Eve] to you two.<br>But after searching all of Yangang Territory for so long,<br>I gained an insight of my own and broke into <span class='realm_cloudy'>Nimbus Rank</span> one day.<br>Looks like the seat of clan head<br>is mine for a few more years!",
                unlocks: {
                    textlines: [{dialogue: "纳布(宝库)", lines: ["bk5"]}],
                    locations:["狩猎大赛·城门战"],
                },
                locks_lines: ["bk4"],
            }),
            "bk5": new Textline({ 
                is_unlocked: false,
                name: "I won't accept that!",
                text: "[Nabu] It's good for the young to have courage.<br>If Koko has the strength to beat me,<br>then I can retire with peace of mind.",
                unlocks: {
                    locations:["纳家宝库 - X"],
                },
                locks_lines: ["bk5"],
            }),
            "bk6": new Textline({ 
                is_unlocked: false,
                name: "Satisfied now?",
                text: "[Nabu] Fine, fine, fine.<br>Here's what you wanted.<br>Heh, all grown up...<br><br>[Notice]<br>Obtained the Nayaka Clan's treasure [Eve]!<br>The Family system is now active!",
                unlocks: {
                    flags: ["is_family_enabled"],
                },
                locks_lines: ["bk6"],
            }),
        },
    });




    dialogues["枫杏红"] = new Dialogue({
        name: "Feng Xinghong",
        starting_text: "Talk to Feng Xinghong",
        textlines: {

            "fxh1": new Textline({ 
                is_unlocked: false,
                name: "How can I fuse an <img src='image/item/evolve_1e17.png'>Intermediate Evolution Crystal",
                text: "[Feng Xinghong] Many undead roam this ancient tomb,<br>as I'm sure you've noticed.<br>They can't condense Energy Cores inside their bodies,<br>and refine energy very slowly.<br>If you can find a <span class='realm_cloudy'>Nimbus Rank: Stage 3 +</span><br>undead that will eat anything,<br>and feed it 10 <img src='image/item/evolve_1e16_shard.png'>Intermediate Evolution Crystal Shards,<br>there's hope of slaying it on the spot while its aura is unstable after breaking through,<br>and extracting a partially refined <img src='image/item/evolve_1e17.png'>Intermediate Evolution Crystal.",
                unlocks: {
                    textlines: [{dialogue: "枫杏红", lines: ["fxh2"]}],
                },
                locks_lines: ["fxh1"],
            }),
            "fxh2": new Textline({ 
                is_unlocked: false,
                name: "What kind of undead is suitable to hunt?",
                text: "[Feng Xinghong] Even freshly broken into <span class='realm_cloudy'>Nimbus Rank: Stage 4</span> with an unstable aura,<br>the target will still have nearly <span class='realm_cloudy'>Nimbus Rank: Stage 3 +</span> strength.<br>Fortunately, the tomb undead's strength depends heavily on their blood-essence reserves.<br>An agile dog-type undead is probably best,<br>since they're very fragile — find a way to whittle down their HP<br>and you can easily beat them from a lower realm.",
                unlocks: {
                    textlines: [{dialogue: "枫杏红", lines: ["fxh3"]}],
                },
                locks_lines: ["fxh2"],
            }),
            "fxh3": new Textline({ 
                is_unlocked: false,
                name: "You've said all that, so why not help me fight?",
                text: "[Feng Xinghong] The Yangang Territory Hunting Tournament has an age limit.<br>For an ancient like me from 3 eras ago,<br>sneaking in at all was hard enough.<br>If I stepped in, the City Lord's Mansion would escort me back to the city in a heartbeat.<br>So all I can do is help you lay the \"bait\"...",
                unlocks: {
                    textlines: [{dialogue: "枫杏红", lines: ["fxh4"]}],
                },
                locks_lines: ["fxh3"],
            }),
            "fxh4": new Textline({ 
                is_unlocked: false,
                name: "(Provide 10 <img src='image/item/evolve_1e16_shard.png'>Intermediate Evolution Crystal Shards)",
                text: "[Feng Xinghong]",
                unlocks: {
                    spec: "C1-dog",
                },
            }),
        },
    });

    dialogues["石风雄"] = new Dialogue({
        name: "Shi Fengxiong",
        starting_text: "Talk to Shi Fengxiong",
        textlines: {
            "sfx1": new Textline({ 
                is_unlocked: false,
                name: "City Lord...? Why are you here?",
                text: "[Neko] Isn't this... supposed to be the tournament's finish line?<br><br>[Shi Fengxiong] It was, originally.<br>We mistakenly believed this place's greatest opportunity<br>was a big chunk of C6-grade [Ice Marrow Essence], meant as the tournament prize.<br>Who knew that [Ice Marrow Essence] was only the outer layer,<br>wrapped around a huge chunk of D6-grade [Ice Marrow Mother]!<br>The original winner couldn't have handled such an opportunity,<br>so I had to shoulder this karma myself.",
                unlocks: {
                    textlines: [{dialogue: "石风雄", lines: ["sfx2"]}],
                },
                locks_lines: ["sfx1"],
            }),
            "sfx2": new Textline({ 
                is_unlocked: false,
                name: "...How about you compensate me a few thousand Cosmic Coins.",
                text: "[Shi Fengxiong] That's hardly fair...<br>But you're a rising star of Yangang Territory, little friend;<br>if I suppressed you here, it'd only give those old fellows ammunition.<br>How about this: I'll point you to a place to train,<br>as compensation.",
                unlocks: {
                    textlines: [{dialogue: "石风雄", lines: ["sfx3"]}],
                },
                locks_lines: ["sfx2"],
            }),
            "sfx3": new Textline({ 
                is_unlocked: false,
                name: "Also, tell me — what's this [Yangang Territory Ranking] actually for?",
                text: "[Shi Fengxiong] All the data in it<br>came from a combat-power census back in Era 1350.<br>So even when you kill enemies above your stage, little friend,<br>the numbers won't change.<br>Also, whenever someone reaches the top 1000,<br>there's a city-wide broadcast...<br>but since that mechanism triggered a few times,<br>sales of soundproofing arrays in Yangang City rose 26800%.<br>So the broadcast doesn't mean much either.<br>",
                unlocks: {
                    textlines: [{dialogue: "石风雄", lines: ["sfx4"]}],
                },
                locks_lines: ["sfx3"],
            }),
            "sfx4": new Textline({ 
                is_unlocked: false,
                name: "Alright, now about that training place...",
                text: "[Shi Fengxiong] Set out from Yangang City facing north,<br>then 8.195 million km in the 7h23m40s direction,<br>and you reach the border between Yangang Territory and [Qingbo Territory] —<br>[Puffball Valley],<br>one of the few areas near Yangang Territory<br>where mid-Nimbus Rank powerhouses are active.",
                unlocks: {
                    locations:["毬毬山谷"],
                },
                locks_lines: ["sfx4"],
            }),
        },
    });
    dialogues["玄铁方尖碑"] = new Dialogue({
        name: "Black Iron Obelisk",
        starting_text: "Contemplate the marks on the obelisk",
        textlines: {
            "yxtc": new Textline({ 
                is_unlocked: false,
                name: "Sublimate [Starlight Bloom]",
                text: "[Starlight Bloom] has been elevated to [Starlight Skyhue]!<br>Unlocked skill [Starlight Skyhue] (XP ~ level 50 Starlight Bloom),<br>stances [Starlight Skyhue: Pure] (initially ~ level 40 Starlight Bloom: Giant Star),<br>[Starlight Skyhue: Iridescent] (~ level 40 Starlight Bloom: Starfield),<br>[Starlight Skyhue: Double Rainbow] (Double Strike, total DPS slightly below Iridescent),<br>[Starlight Skyhue: Blood Slaughter] (lifesteal, total DPS slightly below Iridescent)<br><br>Note: [Starlight Bloom: Flower Sea] cannot be sublimated. It has already reached perfection.",
                unlocks: {
                    stances: ["SR_Power","SR_Multi","SR_Double","SR_Blood"],
                },
                
                locks_lines: ["yxtc"],
            }),
        }
    });
    dialogues["地层钻探"] = new Dialogue({
        name: "Stratum Drilling",
        starting_text: "[Stratum Drilling]",
        textlines: {
            "dczt": new Textline({ 
                is_unlocked: false,
                name: "Perform [Stratum Drilling]",
                text: "...",
                unlocks: {
                    spec:"ground-digging",
                },
            }),
        }
    });

    dialogues["心之石像"] = new Dialogue({
        name: "Heart Stone Idol",
        starting_text: "Crystallize insights accumulated in battle",
        textlines: {
            "clumbs": new Textline({ 
                is_unlocked: true,
                name: "Wild Beast Forest Insight / Click to receive!! (will be removed in v1.10)",
                text: "...",
                unlocks: {
                    spec:"A1-fusion",
                },
                
                locks_lines: ["clumbs"],
            }),
        }
    });
})();

export {dialogues};