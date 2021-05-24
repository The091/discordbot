const Discord = require("discord.js");
const { disconnect } = require("process");
const ytdl = require("ytdl-core");
const Client = new Discord.Client({
    partials: ["MESSAGE", "REACTION"]
})


const prefix = ".";

Client.on("ready" , () => {
    console.log('Bot Pret');

    

});

Client.on("guildMemberAdd", member => {
    member.guild.channels.cache.find(channel => channel.id === "829501480347500564").send("<@" + member.id + ">" + "**  😜  __Bienvenue au nouveau membre sur notre serveur !__ 😜   ** !\nNous somme desprmais **" + member.guild.memberCount + "** sur le serveur !");
    member.roles.add("829522742805659648").then(mbr =>{
        console.log('roles attribuer ' + mbr.displayName)
    }).catch(() => {
        console.log("role pas attribuer !")
    });
});

Client.on("guildMemberRemove", member => {
    member.guild.channels.cache.find(channel => channel.id === "835991579184595004").send("<@" + member.id + ">" + "**  😢  __Un membre est partie de notre serveur !__ 😢   **");
}); 


Client.on("messageReactionAdd", (reaction, user) => {
    if(user.bot)return;

    /*console.log('reaction ajouter par ' + user.username + "\nNom de l'emoji " + reaction.emoji.name + "c'est le " + reaction.count + 'e reaction');*/

    
    
});

Client.on("messageReactionRemove", (reaction, user) => {
    if(user.bot)return;

    /*console.log('reaction retirer par ' + user.username + "!\nNom de l'emoji " + reaction.emoji.name + "c'est le " + reaction.count + 'e reaction');*/

    if(reaction.message.id === "835573560432001043"){
        if(reaction.emoji.name === ":white_check_mark:"){
            var member = reaction.message.guild.members.cache.find(member => member.id === user.id);
            member.roles.add("829522742805659648").then(mbr =>{
                console.log('roles attribuer ' + mbr.displayName)
            }).catch(() => {
                console.log("role pas attribuer !")
            });
        
        }
    }
});

var list  = [];

function playMusic(connection) {
    let dispatcher = connection.play(ytdl(list[0], {quality: "highestaudio"}));

    dispatcher.on("finish", () =>{
        list.shift();
        dispatcher.destroy();

        if(list.length > 0){
            playMusic(connection);
        }
        else{
            connection.disconnect();
        }
    });

    dispatcher.on("error", err => {
        console.log("erreur de dispatcher : " + err);
        dispatcher.destroy();
        connection.disconnect();
    });
}



Client.on("message", async message => {
    if (message.member.permissions.has("MANAGE_MESSAGES")){
        if (message.content.startsWith(prefix + "clear")){
            let args = message.content.split(" ");

            if(args[1] == undefined){
                message.reply("**❌Nombre de message non ou mal defini❌.** ");
            }
            else{
                let number = parseInt(args[1]);

                if(isNaN(number)){
                    message.reply("**❌Nombre de message non ou mal defini❌.** ");
                }
                else{
                    message.channel.bulkDelete(number+1, false).then(messages =>{
                        console.log("suppression " + messages.size + ' message reussi !')
                        message.reply("✅suppression de " + messages.size + " message reussi !✅")
                    }).catch(err => {
                        console.log("eurreur de clear : " + err);

                    });
                }
            }
        }
    }







    
    

    if(message.content === prefix + "playlist"){
        let msg = "**FILES D'ATTENTE ! **\n";
        for(var i = 1; i < list.length;i++){
            let name;
            let getinfo = await ytdl.getBasicInfo(list[i]);
            name = getinfo.videoDetails.title;
            msg += "> " + i + " - " + name +"\n";
        }
        message.channel.send(msg);
    }
    else if(message.content.startsWith(prefix + "play")){
        if(message.member.voice.channel){
            let args = message.content.split(" ");


            if(args[1] == undefined || !args[1].startsWith("https://www.youtube.com/watch?v=")){
                message.reply("❌Lien de la video non ou mal mentionné.❌ ");
            }
            else{
                if(list.length > 0){
                    list.push(args[1]);
                    message.reply("✅ Video bien ajouté a la liste.✅ ");
                }
                else{
                    list.push(args[1]);
                    message.reply("✅ Vidéo ajouter à la liste.✅ ");

                    message.member.voice.channel.join().then(connection => {
                        playMusic(connection);


                        connection.on("disconnect", () => {
                            list = [];
                        });

                    }).catch(err => {
                        message.reply("❌erreur lors de la connexion❌ : " + err);
                    });
                }
            }
        }
    }
    
    
    
    if(message.author.bot)return;
    if(message.channel.type == "dm") return;

    if(message.member.hasPermission('ADMINISTRATOR')){
        if(message.content.startsWith(prefix + "ban")){
            let mention = message.mentions.members.first();

            if(mention == undefined){
                message.reply('Membre non ou mal mentionné');
            }
            else{
                if(mention.bannable){
                    mention.ban();
                    message.channel.send(mention.displayName + "a été banni avec succès");
                }
                else{
                    message.reply("Impossible de bannir se membre. ");
                }
            }
        }
        else if(message.content.startsWith(prefix + "kick")){
            let mention = message.mentions.members.first();

            if(mention == undefined){
                message.reply('Membre non ou mal mentionné');
            }
            else {
                if(mention.kickable){
                    mention.kick();
                    message.channel.send(mention.displayName + "a été kick avec succes");
                }
                else{
                    message.reply("Impossible de kick se membre. ");
                }
            }
        }
        else if (message.content.startsWith(prefix + "mute")){
            let mention = message.mentions.members.first()

            if(mention == undefined){
                message.reply('Membre non ou mal mentionné');
            }
            else{
                mention.roles.add("833701785506938931")
                mention.roles.remove("829522742805659648")
                message.reply(mention.displayName + " muté avec succès")
            }
        }
        else if (message.content.startsWith(prefix + "unmute")){
            let mention = message.mentions.members.first()

            if(mention == undefined){
                message.reply('Membre non ou mal mentionné');
            }
            else{
                mention.roles.add("829522742805659648")
                mention.roles.remove("833701785506938931")
                message.reply(mention.displayName + " unmute avec succès")

            }
        }
        else if (message.content.startsWith(prefix + "tempsmute")){
            let mention = message.mentions.members.first();

            if(mention == undefined){
                message.reply('Membre non ou mal mentionné');
            }
            else{
                let args = message.content.split(" ");

                mention.roles.add("833701785506938931");
                mention.roles.remove("829522742805659648");
                setTimeout(function() {
                    mention.roles.remove("833701785506938931");
                    mention.roles.add("829522742805659648");
                    message.channel.send("<@" + mention.id + "> tu peut desormais parler de nouveau");
                }, args[2] * 1000);

            }
        }
        
        
        
    }

    /*message.react("😉");*/

    if(message.content == prefix + "ip"){
        message.channel.send("51.210.83.219:25575 serveur off");
    }


    

 
});




Client.login("ODI4OTc4MzE0NDEyMTYzMTYy.YGxcNw.IyGNqZkUiXvXeIzMdpxQO0f_srw");
