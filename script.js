//Listen for changes to anything marked as a formula input

$(document).ready(function(){
    console.log('here we go');
    $(".formulainput").keyup(function(){
        dothework();
    });
    $(".precalcformulainput").keyup(function(){
        $("#firearmsbuff").val($("#precalcfirearmsbuff").val());
        $("#magazinedmg").val($("#precalcmagazinedmg").val());
        $("#glovesdmg").val($("#precalcglovesdmg").val());
        dothework();

    });
 
});

var dothework = function() {
    var vals = getVals();
    var ingame = isNaN(inGameDps(vals).toFixed(2)) ? '*' :inGameDps(vals).toFixed(2) ;
    var actualhs = isNaN(actualHsChanceDps(vals).toFixed(2)) ? '*' : actualHsChanceDps(vals).toFixed(2);
    var burst = isNaN(burstDps(vals).toFixed(2)) ? '*' : burstDps(vals).toFixed(2);

    $("#ingamedpsoutput").text(commafy(ingame));
    $("#actualhschancedpsoutput").text(commafy(actualhs));
    $("#burstdpsoutput").text(commafy(burst));
}

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

var commafy = function(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

var inGameDps = function(vals){
    //(Per bullet dmg + (crit chance  * crit dmg bonus) + (accuracy * hs dmg bonus) + (crit chance * crit dmg bonus * accuracy * hs dmg bonus))
    // ALL THAT TIMES MAG SIZE
    //ALL THAT divided by (Mag size/(rpm/60)+reload time)

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
    var crits = vals.critchance * vals.critdmg;
    var hsbonus = perbulletdmg * vals.likelyheadshotchance * vals.headshotbonusdmg;
    var hscrit = crits * vals.likelyheadshotchance * vals.headshotbonusdmg;

    var numerator = (perbulletdmg + crits + hsbonus + hscrit);

    var denominator = vals.magazinesize / vals.magazinesize/(vals.rpm/60);

    return numerator/denominator;
};
