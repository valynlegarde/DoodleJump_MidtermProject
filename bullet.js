const BULLET_RADIUS=5;

class Bullet{
    constructor(xCentre,yCentre,context){
        this.xCentre=xCentre;
        this.yCentre=yCentre;
        this.context=context;
        this.bulletSound=AUDIOS.bullet.cloneNode();
        this.radius=BULLET_RADIUS;
        this.count=0;
        
    }

    bulletDraw(status)
    {
        this.context.beginPath();
        this.context.arc(this.xCentre-this.radius, this.yCentre-this.radius,BULLET_RADIUS, 0, 2 * Math.PI);
        if(status=='isEnemy')
        {
        this.context.fillStyle='red';
        }
        else if(status=='isDoodle')
        {
            this.context.fillStyle='yellow';
        }
        this.context.fill();
        this.context.stroke();
        if(this.count==0)
        {
            this.bulletSound.play();
            this.count=1;
        }

    }

    bulletMove(theta,status)
    {   if(status=='isDoodle')
        {
        if(this.yCentre+BULLET_RADIUS>0){
            this.yCentre+=-9;
        }
        }
        if(status=='isEnemy')
        {
            
                this.yCentre+=5*Math.sin(theta);
                this.xCentre+=5*Math.cos(theta);
               
        }
    }
}

