//Listen for changes to anything marked as a formula input

$(document).ready(function(){
   /* console.log('here we go');
    $(".formulainput").keyup(function(){
        dothework();
    });
    $(".precalcformulainput").keyup(function(){
        $("#firearmsbuff").val($("#precalcfirearmsbuff").val());
        $("#magazinedmg").val($("#precalcmagazinedmg").val());
        $("#glovesdmg").val($("#precalcglovesdmg").val());
        dothework();

    });*/

    $(".reduxformulainput").keyup(function(){
        dothework();
    });
    $("#likelyheadshotchance").keyup(function(){
        dothework();
    })
    $(".oinOFF").click(function(){
        oneisnoneUiToggles();
        $('#reduxoneisnone').val("false");
        dothework();
    });
    $(".oinON").click(function(){
        oneisnoneUiToggles();
        $('#reduxoneisnone').val("true");
        dothework();
    });
});



var oneisnoneUiToggles = function(){
    $(".oinOFF").toggleClass("btn-default");
    $(".oinOFF").toggleClass("btn-warning");
    $(".oinON").toggleClass("btn-default");
    $(".oinON").toggleClass("btn-warning");
}


var reduxdpscalc = function(valsfromuser) {

    var vals ={};
    var userhsvals = {};
    var gamehsvals = {};

    //I have a gun that does damage per bullet
    gamehsvals.perbulletdmg = valsfromuser.perbulletdmg;
    userhsvals.perbulletdmg = valsfromuser.perbulletdmg;

    //I have a % of bonus headshot dmg, which I convert to bonus headshot dmg
    gamehsvals.headshotbonusdmg = valsfromuser.headshotbonusdmg;
    userhsvals.headshotbonusdmg = valsfromuser.headshotbonusdmg;

    //When I land a headshot, I do damage per headshot
    gamehsvals.headshotperbulletdmg = gamehsvals.perbulletdmg * gamehsvals.headshotbonusdmg;
    userhsvals.headshotperbulletdmg = userhsvals.perbulletdmg * userhsvals.headshotbonusdmg;

    //I have 0.82 accuracy rating The game assumes I have an chance to land a headshot every time I fire
    gamehsvals.accuracy = valsfromuser.accuracy;
    userhsvals.accuracy = valsfromuser.likelyheadshotchance;

    //I can fire bullets in one mag
    gamehsvals.magsize = valsfromuser.magsize;
    userhsvals.magsize = valsfromuser.magsize;

    //Based on this, over the course of one mag, of my bullet are not headshots
    gamehsvals.nonhspermag = gamehsvals.magsize * (1 - gamehsvals.accuracy);
    userhsvals.nonhspermag = userhsvals.magsize * (1 - userhsvals.accuracy);

    //That means that the remaining bullets are headshots
    gamehsvals.hspermag = gamehsvals.magsize * gamehsvals.accuracy;
    userhsvals.hspermag = userhsvals.magsize * userhsvals.accuracy;

    //The One is None talent buys mean extra 11.89 bullets per magazine
    if(valsfromuser.oneisnone === true){
        gamehsvals.oneisnoneextra = 0.5 * gamehsvals.hspermag;
        userhsvals.oneisnoneextra = 0.5 * userhsvals.hspermag;
    } else {
        gamehsvals.oneisnoneextra = 0;
        userhsvals.oneisnoneextra = 0;
    }
    

    //My adjusted magazine size is 40.89 bullets
    gamehsvals.adjmagsize = gamehsvals.magsize + gamehsvals.oneisnoneextra;
    userhsvals.adjmagsize = userhsvals.magsize + userhsvals.oneisnoneextra;

    //My adjusted non-headshot bullet count is 7.36 bullets
    gamehsvals.adjnonhspermag = gamehsvals.nonhspermag + (gamehsvals.oneisnoneextra * (1-gamehsvals.accuracy));
    userhsvals.adjnonhspermag = userhsvals.nonhspermag + (userhsvals.oneisnoneextra * (1-userhsvals.accuracy));

    //My adjusted headshot bullet count is 33.53 bullets

    gamehsvals.adjhspermag = gamehsvals.hspermag + (gamehsvals.oneisnoneextra * gamehsvals.accuracy);
    userhsvals.adjhspermag = userhsvals.hspermag + (userhsvals.oneisnoneextra * userhsvals.accuracy);

    //I have 0.15 chance to crit
    gamehsvals.critchance = valsfromuser.critchance;
    userhsvals.critchance = valsfromuser.critchance;

    //I have 0.77 bonus crit dmg
    gamehsvals.critbonus = valsfromuser.critbonus;
    userhsvals.critbonus = valsfromuser.critbonus;

    //When I crit with a non-headshot, I do 31817.52 non headshot dmg
    gamehsvals.nonhscrit = gamehsvals.perbulletdmg * (1 + gamehsvals.critbonus);
    userhsvals.nonhscrit = userhsvals.perbulletdmg * (1 + userhsvals.critbonus);

    //When I crit with a headshot, I do 76998.40 crit headshot dmg
    gamehsvals.hscrit = gamehsvals.headshotperbulletdmg * (1 + gamehsvals.critbonus);
    userhsvals.hscrit = userhsvals.headshotperbulletdmg * (1 + userhsvals.critbonus);


    //Based on my crit chance, 1.07 of my non-headshots will crit
    gamehsvals.numnonhscrits = gamehsvals.adjnonhspermag * gamehsvals.critchance;
    userhsvals.numnonhscrits = userhsvals.adjnonhspermag * userhsvals.critchance;

    //Based on my crit chance, 4.86 of my headshots will be crits
    gamehsvals.numhscrits = gamehsvals.adjhspermag * gamehsvals.critchance;
    userhsvals.numhscrits = userhsvals.adjhspermag * userhsvals.critchance;



    //Over a space of 40.89 bullets (my adjusted mag size)

    //I will do a total of  6.29 non crit, non headshots
    gamehsvals.numnoncritnonhs = gamehsvals.adjnonhspermag - gamehsvals.numnonhscrits;
    userhsvals.numnoncritnonhs = userhsvals.adjnonhspermag - userhsvals.numnonhscrits;

    //I will do a total of 28.67 non crit headshots
    gamehsvals.numnoncriths = gamehsvals.adjhspermag - gamehsvals.numhscrits;
    userhsvals.numnoncriths = userhsvals.adjhspermag - userhsvals.numhscrits;

    //I will do a total of 1.07 non headshot crits
    //alredy set

    //I will do a total of 4.86 crit headshots
    //already set


    //In damage terms


    //I will do a total of  113122.45 non crit, non headshot dmg
    gamehsvals.noncritnonhstotaldmg = gamehsvals.perbulletdmg * gamehsvals.numnoncritnonhs;
    userhsvals.noncritnonhstotaldmg = userhsvals.perbulletdmg * userhsvals.numnoncritnonhs;

    //I will do a total of 1247112.13 non crit headshot dmg
    gamehsvals.noncrittotalhsdmg = gamehsvals.headshotperbulletdmg * gamehsvals.numnoncriths;
    userhsvals.noncrittotalhsdmg = userhsvals.headshotperbulletdmg * userhsvals.numnoncriths;

    //I will do a total of 33956.58 non headshot crit dmg
    gamehsvals.nonhscrittotaldmg = gamehsvals.numnonhscrits * gamehsvals.nonhscrit;
    userhsvals.nonhscrittotaldmg = userhsvals.numnonhscrits * userhsvals.nonhscrit;

    //I will do a total of 374352.43 crit headshot dmg
    gamehsvals.hscrittotaldmg = gamehsvals.numhscrits * gamehsvals.hscrit;
    userhsvals.hscrittotaldmg = userhsvals.numhscrits * userhsvals.hscrit;



    //In total, over a magazine (cycle) I will deal 1768543.59 damage
    gamehsvals.magtotaldmg = gamehsvals.noncritnonhstotaldmg + gamehsvals.noncrittotalhsdmg + gamehsvals.nonhscrittotaldmg + gamehsvals.hscrittotaldmg;
    userhsvals.magtotaldmg = userhsvals.noncritnonhstotaldmg + userhsvals.noncrittotalhsdmg + userhsvals.nonhscrittotaldmg + userhsvals.hscrittotaldmg;




    //I have a gun that fires at a rate of 275.00 RPM
    gamehsvals.rpm = valsfromuser.rpm;
    userhsvals.rpm = valsfromuser.rpm;

    //I takes 3.00 seconds to reload
    gamehsvals.reloadtime = valsfromuser.reloadtime;
    userhsvals.reloadtime = valsfromuser.reloadtime;

    //It has an adjusted mag size of 40.89 bullets in its mag
    //already set

    //It can fire 4.58 bullets per second
    gamehsvals.bulletspersecond = gamehsvals.rpm/60;
    userhsvals.bulletspersecond = userhsvals.rpm/60;

    //It takes 8.92 to dump its full mag
    gamehsvals.dumptime = gamehsvals.adjmagsize / gamehsvals.bulletspersecond;
    userhsvals.dumptime = userhsvals.adjmagsize / userhsvals.bulletspersecond;

    //To dump the mag and reload takes 11.92 seconds (cycle time)
    gamehsvals.cycletime = gamehsvals.dumptime + gamehsvals.reloadtime;
    userhsvals.cycletime = userhsvals.dumptime + userhsvals.reloadtime;


    //Per second I will deal 148349.65 damage
    gamehsvals.adjdps = gamehsvals.magtotaldmg / gamehsvals.cycletime;
    userhsvals.adjdps = userhsvals.magtotaldmg / userhsvals.cycletime;

    //my burst dps is
    gamehsvals.burstdps = gamehsvals.magtotaldmg / gamehsvals.dumptime;
    userhsvals.burstdps = userhsvals.magtotaldmg / userhsvals.dumptime;

    vals.userhsvals = userhsvals;
    vals.gamehsvals = gamehsvals;
    
    return vals;
};



var dothework = function() {
    var vals = reduxdpscalc(getreduxvals());
    var ingame = isNaN(vals.gamehsvals.adjdps.toFixed(2)) ? '*' : vals.gamehsvals.adjdps.toFixed(2) ;
    var actualhs = isNaN(vals.userhsvals.adjdps.toFixed(2)) ? '*' : vals.userhsvals.adjdps.toFixed(2);

    var burst = isNaN(vals.userhsvals.burstdps.toFixed(2)) ? '*' : vals.userhsvals.burstdps.toFixed(2);
    $("#reduxadjmagsize").val(vals.gamehsvals.adjmagsize);
    
    $("#ingamedpsoutput").text(commafy(ingame));
    $("#actualhschancedpsoutput").text(commafy(actualhs));
    $("#burstdpsoutput").text(commafy(burst));
}

var getreduxvals = function(){
    var valsfromuser = {};
    valsfromuser.perbulletdmg = Number($("#reduxweapondmg").val());
    valsfromuser.accuracy = Number($("#reduxaccuracy").val() * 0.001);
    valsfromuser.headshotbonusdmg = Number($("#reduxheadshotbonus").val() * 0.01);
    valsfromuser.critchance = Number($("#reduxcritchance").val() * 0.01);
    valsfromuser.critbonus = Number($("#reduxbonuscritdmg").val() * 0.01);
    valsfromuser.rpm = Number($("#reduxrpm").val());
    valsfromuser.reloadtime = Number($("#reduxreload").val());
    valsfromuser.magsize = Number($("#reduxmagsize").val());
    valsfromuser.likelyheadshotchance =  Number($("#likelyheadshotchance").val() * 0.01);
    valsfromuser.oneisnone = $("#reduxoneisnone").val() === "true" ? true : false;
    valsfromuser.likelyheadshotchance = Number($("#likelyheadshotchance").val() * 0.01);

    return valsfromuser;
};

var commafy = function(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/*
var getVals = function(){
    var vals = {};
    //get the values from the inputs
    vals.precalcfirearmsbuff = (Number($("#precalcfirearmsbuff").val()) + 100) * 0.01;
    vals.precalcmagazinedmg = Number($("#precalcmagazinedmg").val() * 0.01);
    vals.precalcglovesdmg = Number($("#precalcglovesdmg").val());
    vals.preaclcperbulletdmg = Number($("#precalcperbulletdmg").val());


vals.firearmsbuff = (Number($("#firearmsbuff").val()) + 100) * 0.01;
    vals.magazinedmg = Number($("#magazinedmg").val() * 0.01);
    vals.glovesdmg = Number($("#glovesdmg").val());
    vals.critchance = Number($("#critchance").val() * 0.01);
    vals.critdmg = Number($("#critdmg").val() * 0.01);
    vals.accuracy = Number($("#accuracy").val() * 0.001);
    vals.headshotbonusdmg = Number($("#headshotbonusdmg").val() * 0.01);
    vals.rpm = Number($("#rpm").val());
    vals.reloadtime = Number($("#reloadtime").val());
    vals.magazinesize = Number($("#magazinesize").val());
    vals.likelyheadshotchance = Number($("#likelyheadshotchance").val() * 0.01);

    vals.weaponbasedmg = (vals.preaclcperbulletdmg/(vals.precalcfirearmsbuff + vals.precalcmagazinedmg)) - vals.precalcglovesdmg;
    $("#precalcweaponbasedmg").val(vals.weaponbasedmg);
    var perbulletcalculated = (vals.weaponbasedmg + vals.glovesdmg ) * ( vals.magazinedmg + vals.firearmsbuff);;

    vals.perbulletdmg = perbulletcalculated;
    $("#perbulletdmg").val(perbulletcalculated);
    
    return vals;
};


/*
var inGameDps = function(vals){
    
    var crits = (vals.critchance * vals.critdmg);
    var hsbonus = (vals.perbulletdmg * vals.accuracy * vals.headshotbonusdmg);
    var hscrit =  (vals.critchance * vals.critdmg * vals.accuracy * vals.headshotbonusdmg);

    var numerator = (vals.perbulletdmg + crits + hsbonus + hscrit) * vals.magazinesize;

    var denominator = (vals.magazinesize/(vals.rpm/60) + vals.reloadtime);

    return numerator / denominator;
};

var actualHsChanceDps = function(vals){
    var crits = (vals.critchance * vals.critdmg);
    var hsbonus = (vals.perbulletdmg * vals.likelyheadshotchance * vals.headshotbonusdmg);
    var hscrit =  (vals.critchance * vals.critdmg * vals.likelyheadshotchance * vals.headshotbonusdmg);

    var numerator = (vals.perbulletdmg + crits + hsbonus + hscrit) * vals.magazinesize;

    var denominator = (vals.magazinesize/(vals.rpm/60) + vals.reloadtime);

    return numerator / denominator;
};

var burstDps = function(vals){

    var perbulletdmg = vals.perbulletdmg;
    var crits = perbulletdmg * vals.critchance * vals.critdmg;
    var hsbonus = perbulletdmg * vals.likelyheadshotchance * vals.headshotbonusdmg;
    var hscrit = crits * vals.likelyheadshotchance * vals.headshotbonusdmg;

    var dmgitems = vals.perbulletdmg + crits + hscrit;

    var numerator = dmgitems * vals.magazinesize;

    var magdumptime = vals.magazinesize / (vals.rpm/60);

    var denominator = magdumptime;

    return numerator/denominator;
};
*/
