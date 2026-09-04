import { add_xp_to_skill } from "./main.js";

const effect_templates = {}; 
//templates, since some effects will appear across multiple items but with different durations

class ActiveEffect {
    /**
     *
     * @param {Object} effect_data
     * @param {String} effect_data.name
     * @param {String} [effect_data.id]
     * @param {Number} effect_data.duration
     * @param {Object} effect_data.effects {stats}
     */
    constructor({name, id, duration, effects}) {
        this.name = name;
        this.id = id || name;
        this.duration = duration ?? 0;
        this.effects = effects;
    }
}

effect_templates["Weak healing powder"] = new ActiveEffect({
    name: "Weak healing powder",
    effects: {
        stats: {
            health_regeneration_flat: {flat: 1},
        }
    }
});
effect_templates["Weak healing potion"] = new ActiveEffect({
    name: "Weak healing potion",
    effects: {
        stats: {
            health_regeneration_flat: {flat: 6},
            health_regeneration_percent: {flat: 1},
        }
    }
});

effect_templates["Slight food poisoning"] = new ActiveEffect({
    name: "Slight food poisoning",
    effects: {
        stats: {
            health_regeneration_flat: {flat: -0.5},
        }
    }
});

//NekoRPG effects below

effect_templates["Satiated"] = new ActiveEffect({
    name: "Satiated",
    effects: {
        stats: {
            health_regeneration_flat: {flat: 40},
        }
    }
});

effect_templates["Satiated II"] = new ActiveEffect({
    name: "Satiated II",
    effects: {
        stats: {
            health_regeneration_flat: {flat: 80},
        }
    }
});

effect_templates["Satiated III"] = new ActiveEffect({
    name: "Satiated III",
    effects: {
        stats: {
            health_regeneration_flat: {flat: 400},
            attack_power:{flat:20},
            defense:{flat:20},
            agility:{flat:20},
        }
    }
});


effect_templates["Recovery A1"] = new ActiveEffect({
    name: "Recovery A1",
    effects: {
        stats: {
            health_regeneration_flat: {flat: 1500},
        }
    }
});


effect_templates["Enhance A1"] = new ActiveEffect({
    name: "Enhance A1",
    effects: {
        stats: {
            health_regeneration_percent: {flat: 1},
            attack_power:{flat:1600},
            defense:{flat:1600},
            agility:{flat:1600},
        }
    }
});
effect_templates["Recovery A8"] = new ActiveEffect({
    name: "Recovery A8",
    effects: {
        stats: {
            health_regeneration_flat: {flat: 600000},
        }
    }
});


effect_templates["Enhance A8"] = new ActiveEffect({
    name: "Enhance A8",
    effects: {
        stats: {
            health_regeneration_percent: {flat: 1},
            attack_power:{flat:256000},
            defense:{flat:256000},
            agility:{flat:256000},
        }
    }
});


effect_templates["Weakness"] = new ActiveEffect({
    name: "Weakness",
    effects: {
        stats: {
            health_regeneration_percent: {flat: -1},
        }
    }
});



effect_templates["Satiated IV"] = new ActiveEffect({
    name: "Satiated IV",
    effects: {
        stats: {
            health_regeneration_flat: {flat: 2000},
            attack_power:{flat:400},
            defense:{flat:400},
            agility:{flat:400},
        }
    }
});

effect_templates["Satiated V"] = new ActiveEffect({
    name: "Satiated V",
    effects: {
        stats: {
            health_regeneration_flat: {flat: 12000},
            attack_power:{flat:800},
            defense:{flat:800},
            agility:{flat:800},
        }
    }
});
effect_templates["Satiated VI"] = new ActiveEffect({
    name: "Satiated VI",
    effects: {
        stats: {
            health_regeneration_flat: {flat: 180000},
            attack_power:{flat:12000},
            defense:{flat:12000},
            agility:{flat:12000},
        }
    }
});


effect_templates["Satiated VII"] = new ActiveEffect({
    name: "Satiated VII",
    effects: {
        stats: {
            health_regeneration_flat: {flat: 1200000},
            attack_power:{flat:32000},
            defense:{flat:32000},
            agility:{flat:32000},
        }
    }
});

effect_templates["Satiated VIII"] = new ActiveEffect({
    name: "Satiated VIII",
    effects: {
        stats: {
            health_regeneration_flat: {flat: 32000000},
            attack_power:{flat:640000},
            defense:{flat:640000},
            agility:{flat:640000},
        }
    }
});


effect_templates["Magic Attack A9"] = new ActiveEffect({
    name: "Magic Attack A9",
    effects: {
        stats: {
            attack_mul: {multiplier: 0.9},
        }
    }
});

effect_templates["Suppression A9"] = new ActiveEffect({
    name: "Suppression A9",
    effects: {
        stats: {
        }
    }
});

effect_templates["Whirlwind A9"] = new ActiveEffect({
    name: "Whirlwind A9",
    effects: {
        stats: {
            health_regeneration_percent: {flat: -1},
        }
    }
});

effect_templates["Fortify A9"] = new ActiveEffect({
    name: "Fortify A9",
    effects: {
        stats: {
            health_regeneration_percent: {flat: -1},
        }
    }
});

effect_templates["Spirit Flash B9"] = new ActiveEffect({
    name: "Spirit Flash B9",
    effects: {stats: {}}
});
effect_templates["Scatter B9"] = new ActiveEffect({
    name: "Scatter B9",
    effects: {stats: {health_regeneration_percent: {flat: -1}}}
});
effect_templates["Reversal B9"] = new ActiveEffect({
    name: "Reversal B9",
    effects: {stats: {attack_mul: {multiplier: 0.8}}}
});
effect_templates["Void Gate B9"] = new ActiveEffect({
    name: "Void Gate B9",
    effects: {stats: {attack_mul: {multiplier: 0.1}}}
});


effect_templates["Moonlight Blessing: New Moon"] = new ActiveEffect({
    name: "Moonlight Blessing: New Moon",
    effects: {stats: {health_regeneration_percent: {flat: 1}}}
});
effect_templates["Moonlight Blessing: Crescent Moon"] = new ActiveEffect({
    name: "Moonlight Blessing: Crescent Moon",
    effects: {stats: {max_health: {multiplier: 1.5}}}
});
effect_templates["Moonlight Blessing: First Quarter"] = new ActiveEffect({
    name: "Moonlight Blessing: First Quarter",
    effects: {stats: {crit_multiplier: {multiplier: 1.6}}}
});
effect_templates["Moonlight Blessing: Waxing Gibbous"] = new ActiveEffect({
    name: "Moonlight Blessing: Waxing Gibbous",
    effects: {stats: {attack_mul: {multiplier: 1.4}}}
});
effect_templates["Moonlight Blessing: Full Moon"] = new ActiveEffect({
    name: "Moonlight Blessing: Full Moon",
    effects: {stats: {attack_power: {multiplier: 1.1}}}
});
effect_templates["Moonlight Blessing: Waning Gibbous"] = new ActiveEffect({
    name: "Moonlight Blessing: Waning Gibbous",
    effects: {stats: {defense: {multiplier: 1.2}}}
});
effect_templates["Moonlight Blessing: Last Quarter"] = new ActiveEffect({
    name: "Moonlight Blessing: Last Quarter",
    effects: {stats: {agility: {multiplier: 1.2}}}
});
effect_templates["Moonlight Blessing: Waning Crescent"] = new ActiveEffect({
    name: "Moonlight Blessing: Waning Crescent",
    effects: {stats: {attack_speed: {multiplier: 1.1}}}
});
effect_templates["Radiation"] = new ActiveEffect({
    name: "Radiation",
    effects: {stats: {max_health: {multiplier: 0.5},health_regeneration_percent:{flat:-8}}}
});

effect_templates["灵感"] = new ActiveEffect({
    name: "Inspiration",
    effects: {stats: {luck:{multiplier: 1.2}}}
});

effect_templates["Recovery B1"] = new ActiveEffect({
    name: "Recovery B1",
    effects: {
        stats: {
            health_regeneration_flat: {flat: 4800000},
            max_health:{flat: 480000000},
        }
    }
});
effect_templates["Recovery B4"] = new ActiveEffect({
    name: "Recovery B4",
    effects: {
        stats: {
            health_regeneration_flat: {flat: 4320e4},
            max_health:{flat: 24e8},
        }
    }
});


effect_templates["恢复 B8"] = new ActiveEffect({
    name: "Recovery B8",
    effects: {
        stats: {
            health_regeneration_flat: {flat: 16.72e8},
            health_regeneration_percent: {flat: 0.168},
        }
    }
});
effect_templates["强化 B8"] = new ActiveEffect({
    name: "Enhance B8",
    effects: {
        stats: {
            attack_power:{flat:2.88e8},
            defense:{flat:2.88e8},
            agility:{flat:2.88e8},
        }
    }
});



effect_templates["饱食 IX"] = new ActiveEffect({
    name: "Satiety IX",
    effects: {
        stats: {
            health_regeneration_flat: {flat: 84.8e8},
            attack_power:{flat:5.4e8},
            defense:{flat:5.4e8},
            agility:{flat:5.4e8},
        }
    }
});


effect_templates["恢复 C2"] = new ActiveEffect({
    name: "Recovery C2",
    effects: {
        stats: {
            health_regeneration_flat: {flat: 327.68e8},
        }
    }
});

effect_templates["饱食 X"] = new ActiveEffect({
    name: "Satiety X",
    effects: {
        stats: {
            health_regeneration_flat: {flat: 168.56e8},
            attack_power:{flat:27e8},
            defense:{flat:27e8},
            agility:{flat:27e8},
        }
    }
});



effect_templates["恢复 C3"] = new ActiveEffect({
    name: "Recovery C3",
    effects: {
        stats: {
            health_regeneration_flat: {flat: 491.52e8},
            health_regeneration_percent: {flat: 0.1},
        }
    }
});
effect_templates["恢复 C4"] = new ActiveEffect({
    name: "Recovery C4",
    effects: {
        stats: {
            health_regeneration_flat: {flat: 983.04e8},
            health_regeneration_percent: {flat: 0.125},
        }
    }
});

effect_templates["强化 C3"] = new ActiveEffect({
    name: "Enhance C3",
    effects: {
        stats: {
            attack_power:{flat:162e8},
            defense:{flat:162e8},
            agility:{flat:162e8},
        }
    }
});
effect_templates["强化 C3G"] = new ActiveEffect({
    name: "Enhance C3G",
    effects: {
        stats: {
            attack_power:{flat:216e8},
            defense:{flat:216e8},
            agility:{flat:216e8},
        }
    }
});







effect_templates["烈日祝福·乾"] = new ActiveEffect({
    name: "Blazing Sun Blessing: Qian",
    effects: {stats: {max_health: {multiplier: 1.8}}}
});
effect_templates["烈日祝福·兑"] = new ActiveEffect({
    name: "Blazing Sun Blessing: Dui",
    effects: {stats: {health_regeneration_percent: {flat: 1.5}}}
});
effect_templates["烈日祝福·离"] = new ActiveEffect({
    name: "Blazing Sun Blessing: Li",
    effects: {stats: {attack_power: {multiplier: 1.2}}}
});
effect_templates["烈日祝福·震"] = new ActiveEffect({
    name: "Blazing Sun Blessing: Zhen",
    effects: {stats: {attack_speed: {multiplier: 1.15}}}
});
effect_templates["烈日祝福·巽"] = new ActiveEffect({
    name: "Blazing Sun Blessing: Xun",
    effects: {stats: {}}
    //牵制(80%效力)
});
effect_templates["烈日祝福·坎"] = new ActiveEffect({
    name: "Blazing Sun Blessing: Kan",
    effects: {stats: {}}
    //魔攻(20%效力)
});
effect_templates["烈日祝福·艮"] = new ActiveEffect({
    name: "Blazing Sun Blessing: Gen",
    effects: {stats: {attack_mul: {multiplier: 0.8}}}
    //回风(普攻倍率80%)
});
effect_templates["烈日祝福·坤"] = new ActiveEffect({
    name: "Blazing Sun Blessing: Kun",
    effects: {stats: {}}
    //坚固(无副作用/8%)
});


effect_templates["迟缓"] = new ActiveEffect({
    name: "Sluggish",
    effects: {stats: {attack_speed: {multiplier: 0.8}}}
});
effect_templates["灵魂之力 I"] = new ActiveEffect({
    name: "Soul Power I",
    effects: {stats: {max_health: {multiplier: 1.2}}}
});
effect_templates["灵魂之力 II"] = new ActiveEffect({
    name: "Soul Power II",
    effects: {stats: {max_health: {multiplier: 1.2}}}
});
effect_templates["灵魂之力 III"] = new ActiveEffect({
    name: "Soul Power III",
    effects: {stats: {
            attack_power:{flat:1e8},
            defense:{flat:1e8},
            agility:{flat:1e8},}}});
effect_templates["灵魂之力 IV"] = new ActiveEffect({
    name: "Soul Power IV",
    effects: {stats: {
            attack_power:{flat:1e8},
            defense:{flat:1e8},
            agility:{flat:1e8},}}});
effect_templates["灵魂之力 V"] = new ActiveEffect({
    name: "Soul Power V",
    effects: {stats: {
            attack_power:{flat:5e8},
            defense:{flat:5e8},
            agility:{flat:5e8},}}});

/*  let MM1 = ["New Moon","Crescent Moon","First Quarter","Waxing Gibbous","Full Moon","Waning Gibbous","Last Quarter","Waning Crescent"];
                let MM2 = ["HP Regen +1%","Crit Rate x1.5","Crit Damage x1.6","Normal Attack Multiplier x1.4","Attack x1.1","Defense x1.2","Agility x1.2","Speed x1.1"];*/


effect_templates["死线"] = new ActiveEffect({
    name: "Deadline",
    effects: {stats: {}}
});


effect_templates["吹火 C6"] = new ActiveEffect({
    name: "Fire-Blowing C6",
    effects: {stats: {attack_speed: {multiplier: 0.7}}}
});
effect_templates["硬化 C6"] = new ActiveEffect({
    name: "Hardening C6",
    effects: {stats: {attack_mul: {multiplier: 0.4}}}
});
effect_templates["血遁 C6"] = new ActiveEffect({
    name: "Blood Evasion C6",
    effects: {stats: {health_regeneration_percent: {flat: -1},}}
});
effect_templates["压制 C6"] = new ActiveEffect({
    name: "Oppression C6",
    effects: {stats: {}}
});
export {effect_templates, ActiveEffect};
