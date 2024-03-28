const DOODLE_WIDTH=40;
const DOODLE_HEIGHT=40;



var collisionMode=1;

class Doodle
{
    constructor(x,y,context){
        this.width=DOODLE_WIDTH;
        this.height=DOODLE_HEIGHT;
        this.gravity=0.2;
        this.x=x;
        this.y=y;
        this.jumpSound=AUDIOS.jump;
        this.trampSound=AUDIOS.trampSound;
        this.springSound=AUDIOS.springSound;
        this.fakePlatform=AUDIOS.fakePlatform;
        this.obstacleCrash=AUDIOS.obstacleCrash;
        this.jetPack=AUDIOS.jetPack;
        this.context=context;
        this.boostJetpack=0;
        this.direction='isFalling'; //whether doodle going up or down flag
        this.offset=0.1;
        this.collisionMode=collisionMode;
        
    }
    
    
    drawDoodle(player,leftRight){
        this.player=player;
        let doodleWidthOffset=17
        if(leftRight==2){
            
            this.context.drawImage(this.player,this.x,this.y,this.width-doodleWidthOffset,this.height);    
        }
        else{
            // this.context.beginPath();
            // this.context.fillStyle='red';
            // this.context.fillRect(this.x,this.y,this.width,this.height);
            // this.context.closePath();
        this.context.drawImage(this.player,this.x,this.y,this.width,this.height);
        }
    }

    doodleJumpSpeed(score){
        if (score >= 800)
        {
            this.jumpRate = 18;
           
        }
        
        else if (score >= 600 && score < 800)
        {
            this.jumpRate = 18;
           
        }
        
        else if (score >= 400 && score < 600)
        {
            this.jumpRate = 17;
           
        }
        else if (score >= 200 && score < 400)
        {
            this.jumpRate = 15;
            
        }

        else if (score >= 50 && score < 200)
        {
            this.jumpRate = 12;
            
        }
        else{
            this.jumpRate=10;
        }
    }    
    
    moveDoodle(Xchange){
            this.offset+=this.gravity;
            this.y=this.y+ this.offset;
            this.x+=Xchange;
            if(this.offset>=0){
                this.direction='isFalling';
            }
            
            if(this.offset<0){
                this.direction='isFlying'
            }        
            
            
            if(this.offset<0 && this.y<=CANVAS_HEIGHT/2)
            {   
    
                this.y=(CANVAS_HEIGHT/2)+1;
                
            }

        
    }

    obstacleCollision(obsArray){
        this.obstacleArray=obsArray;
        let yoffset=15;
        let heightOffset=15;
        let xoffset=15;
        let obstacleOffset=8;
        for(var k=0;k<this.obstacleArray.length;k++)
        {
            if(this.collisionMode==1 )
            {  
                if(((this.y+yoffset<(this.obstacleArray[k].y+this.obstacleArray[k].height-obstacleOffset) && this.y+yoffset>=this.obstacleArray[k].y) || (this.y+this.height>=this.obstacleArray[k].y+heightOffset && this.y+this.height<=this.obstacleArray[k].y+this.obstacleArray[k].height)) && this.x+this.width-xoffset>=this.obstacleArray[k].x && this.x+xoffset<=this.obstacleArray[k].x+this.obstacleArray[k].width)
                {
                    if(this.obstacleArray[k].type!=5 && this.obstacleArray[k].type!=6)
                    {
                        this.obstacleCrash.play();
                        
                        return 0;
                        
                    }
                    else if (this.obstacleArray[k].type==5)
                    {
                        this.obstacleArray.splice(k,1);
                        k--;
                        return 1;
                    }
                    
                    if (this.obstacleArray[k].type==6)
                    {
                        this.obstacleArray.splice(k,1);
                        k--;
                        return 2;
                    }
                }
            }
            
            break;
        }
    }
    
    
    
    jump(platArray,boosterArray)
    {

        let doodleOffset=12;
        for(var i=0;i<platArray.length;i++)
        {   
           
                if((this.y+this.height>=platArray[i].yPosition && (this.y+this.height<=platArray[i].yPosition+platArray[i].platformHeight))  &&  (this.x+this.width-doodleOffset>=platArray[i].xPosition && this.x+doodleOffset<=(platArray[i].xPosition+platArray[i].platformWidth) ) && this.direction=='isFalling')
                {
                    if(platArray[i].platformType !=3)
                    {
                        if(platArray[i].platformType==4)
                        {
                            platArray[i].jumpCount=1;
                        }
                        this.offset=-this.jumpRate;
                        this.collisionMode=1;
                        
                        this.jumpSound.play();    
                    }
                    else{
                        this.fakePlatform.currentTime=0;
                        this.fakePlatform.play();
                        platArray[i].fakePlatDetect=1;
                    }

                break;
                }
            
        }

        for(let i=0;i<boosterArray.length;i++)
        {   
            if(boosterArray[i].type==1)
            
            {
                if((this.y+this.height>=boosterArray[i].y && (this.y+this.height<=boosterArray[i].y+boosterArray[i].height/2))  &&  (this.x+this.width>=boosterArray[i].x && this.x<=(boosterArray[i].x+boosterArray[i].width) ) && this.direction=='isFalling')
                {
                    this.trampSound.play()
                    this.offset=-20;
                    this.collisionMode=0;
                    
                break;
                }
            }

            if(boosterArray[i].type==2)
            {

                if((this.y+this.height>=boosterArray[i].y && (this.y+this.height<=boosterArray[i].y+boosterArray[i].height/2))  &&  (this.x+this.width>=boosterArray[i].x && this.x<=(boosterArray[i].x+10) ) && this.direction=='isFalling')
                {
                    this.springSound.play();
                    this.offset=-25;
                    this.collisionMode=0;
                    
                break;
                }

                if((this.y+this.height>=boosterArray[i].y && (this.y+this.height<=boosterArray[i].y+boosterArray[i].height/2))  &&  (this.x+this.width>=boosterArray[i].x+15 && this.x<=(boosterArray[i].x+boosterArray[i].width) ) && this.direction=='isFalling')
                {
                    
                    this.offset=-this.jumpRate;
                    this.jumpSound.play();
                    this.collisionMode=1;
                break;
                }

            }
            if(boosterArray[i].type==3 && (this.direction='isFalling' || this.direction=='isFlying'))
            
            {
                let doodleOffset=7;
                if(((this.y+this.height>=boosterArray[i].y && (this.y+this.height<=boosterArray[i].y+boosterArray[i].height)) || (this.y-doodleOffset<=boosterArray[i].y+boosterArray[i].height && (this.y+doodleOffset>=boosterArray[i].y)))  &&  (this.x+this.width>=boosterArray[i].x && this.x<=(boosterArray[i].x+boosterArray[i].width) ) && this.direction=='isFalling')
                {
                    this.jetPack.currentTime=0;
                    this.jetPack.play();
                    this.offset=-50;
                    this.collisionMode=0;
                    boosterArray.splice(i,1);
                    this.boostJetpack=1;

                    i--;
                    
                break;
                }
            }
            
            
        }
    
       
    }


}






