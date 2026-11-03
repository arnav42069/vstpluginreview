"""Original educational charts, synthetic signals and editorial press-image compositions.
No chart is a DAW capture, plugin measurement, recording or emulated product UI.
"""
from pathlib import Path
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch
from PIL import Image,ImageOps,ImageDraw,ImageFont
ROOT=Path('public/media/articles'); made=[]
COLORS=['#e2603e','#2764a4','#a34f99','#27847d','#e4a52c']
plt.rcParams.update({'font.family':'DejaVu Sans','font.size':13,'axes.spines.top':False,'axes.spines.right':False,'axes.labelcolor':'#39414b','xtick.color':'#59636a','ytick.color':'#59636a','text.color':'#202a35'})
def finish(fig,slug,name,title,subtitle,bg='#faf7f1'):
 fig.set_size_inches(16,9);fig.set_dpi(100);fig.patch.set_facecolor(bg)
 fig.suptitle(title,x=.07,y=.95,ha='left',fontsize=28,fontweight='bold')
 fig.text(.07,.885,subtitle,fontsize=13,color='#59636a')
 fig.text(.07,.035,'VST PLUGIN REVIEW  /  ORIGINAL EDUCATIONAL VISUALIZATION',fontsize=10,color='#59636a')
 fig.subplots_adjust(left=.09,right=.95,bottom=.14,top=.81,wspace=.3,hspace=.48)
 for ax in fig.axes:ax.set_facecolor(bg)
 p=ROOT/slug/(name+'.webp');p.parent.mkdir(parents=True,exist_ok=True)
 fig.canvas.draw();Image.fromarray(np.asarray(fig.canvas.buffer_rgba())).convert('RGB').save(p,quality=95,method=6);plt.close(fig);made.append(str(p))
 return p
C='best-compressor-vst-plugins-2026';F='best-free-vst-plugins-2026';K='kick-drum-synthesis-guide';M='modular-synthesis-beginners-guide'
x=np.linspace(-60,0,800)
fig,ax=plt.subplots();ax.plot(x,x,'--',c='#b2b9bf',label='Uncompressed');
for ratio,col in zip([2,4,10],COLORS):ax.plot(x,np.where(x<=-24,x,-24+(x+24)/ratio),c=col,lw=3,label=f'{ratio}:1 ratio')
ax.axvline(-24,c='#b2b9bf',lw=1);ax.set(xlabel='Input level (dB)',ylabel='Output level (dB)',xlim=(-60,0),ylim=(-60,0));ax.legend(loc='upper left',frameon=False)
finish(fig,C,'ratio-curves','Ratio changes the slope','Idealized static curves • threshold −24 dB • timing and knee omitted')
t=np.linspace(0,.6,2000);env=np.where(t<.03,t/.03,np.exp(-(t-.03)*6));comp=env*(1-.52*(1-np.exp(-t/.025)))*np.where(t<.25,1,1+.35*(1-np.exp(-(t-.25)/.08)))
fig,ax=plt.subplots();ax.plot(t*1000,env,c='#a8afb4',lw=3,label='Input envelope');ax.plot(t*1000,comp,c=COLORS[0],lw=4,label='Illustrative gain control');ax.fill_between(t*1000,comp,env,alpha=.1,color=COLORS[0]);ax.set(xlabel='Time (ms)',ylabel='Relative amplitude',ylim=(0,1.1));ax.legend(frameon=False)
finish(fig,C,'timing-envelope','Preserve the front. Shape the recovery.','Synthetic envelope example • not a plugin measurement')
def flow(slug,name,title,subtitle,nodes,edges,bg='#f2f3fc'):
 fig,ax=plt.subplots();ax.set_xlim(-.5,12.8);ax.set_ylim(0,7);ax.axis('off')
 for i,(label,detail,x,y) in enumerate(nodes):
  col=COLORS[i%len(COLORS)];ax.add_patch(FancyBboxPatch((x,y),2.3,1.1,boxstyle='round,pad=.12,rounding_size=.12',facecolor='white',edgecolor=col,lw=2));ax.text(x+1.15,y+.73,label,ha='center',va='center',fontsize=17,fontweight='bold',color='#202a35');ax.text(x+1.15,y+.27,detail,ha='center',va='center',fontsize=11,color='#59636a')
 for a,b,label,col in edges:
  aa=nodes[a];bb=nodes[b];start=(aa[2]+2.3,aa[3]+.55);end=(bb[2],bb[3]+.55)
  ax.annotate('',end,start,arrowprops={'arrowstyle':'->','color':col,'lw':3,'connectionstyle':'arc3,rad=.12'});ax.text((start[0]+end[0])/2,(start[1]+end[1])/2+.3,label,ha='center',fontsize=11,color='#39414b')
 finish(fig,slug,name,title,subtitle,bg)
flow(C,'parallel-routing','Two paths. One controlled blend.','Original parallel-compression routing • delay compensation still matters', [('SOURCE','one performance',.1,3),('DRY','original signal',4.5,4.9),('COMPRESSOR','processed return',4.5,1.2),('SUM','blend & level-match',9.5,3)],[(0,1,'dry','#2764a4'),(0,2,'wet','#e2603e'),(1,3,'','#2764a4'),(2,3,'','#e2603e')],bg='#f9f1ed')
flow(F,'toolkit-flow','A small toolkit, connected.','A suggested production chain • no claim of measured performance',[('SYNTH','generate the part',0,4),('EQ','shape overlap',3.2,4),('DYNAMICS','control movement',6.4,4),('METER','check the result',9.6,4),('REVERB','send / return',6.4,1.2)],[(0,1,'audio','#e2603e'),(1,2,'audio','#2764a4'),(2,3,'audio','#a34f99'),(1,4,'send','#27847d'),(4,3,'return','#27847d')],bg='#fff6ed')
f=np.geomspace(20,20000,1000);response=4*np.exp(-((np.log2(f/1500))/1.1)**2)-5*np.exp(-((np.log2(f/280))/0.8)**2)
fig,ax=plt.subplots();ax.semilogx(f,response,c='#a34f99',lw=4);ax.axhline(0,c='#aab2bd',lw=1);ax.set(xlabel='Frequency (Hz)',ylabel='Gain (dB)',xlim=(20,20000),ylim=(-8,7));ax.set_xticks([20,100,1000,10000]);ax.set_xticklabels(['20','100','1k','10k'])
finish(fig,F,'eq-example','Shape a part. Leave space for another.','Illustrative EQ curve • not a measurement or a recommended preset',bg='#f3eef9')
# A synthetic kick: integrate a declining instantaneous frequency, then multiply by an envelope.
t=np.linspace(0,.36,16000);freq=50+125*np.exp(-t/.016);phase=2*np.pi*np.cumsum(freq)*(t[1]-t[0]);amp=(1-np.exp(-t/.0007))*np.exp(-t/.085);wave=np.sin(phase)*amp
fig,ax=plt.subplots();ax.plot(t*1000,wave,c='#dd633e',lw=1.6);ax.fill_between(t*1000,wave,0,color='#e9a585',alpha=.3);ax.axhline(0,c='#b6ada2',lw=.8);ax.set(xlabel='Time (ms)',ylabel='Amplitude',xlim=(0,360),ylim=(-1,1));
for start,end,label in [(0,18,'TRANSIENT'),(25,110,'BODY'),(120,340,'TAIL')]:ax.axvspan(start,end,alpha=.05,color='#dd633e');ax.text((start+end)/2,1.08,label,fontsize=12,ha='center',color='#9c4d32')
# Dotted separators sit in the gaps between the three illustrative regions.
for boundary in (21.5, 115): ax.axvline(boundary, color='#929a9e', linewidth=.9, linestyle=(0, (1, 3)), zorder=3)
finish(fig,K,'featured','A kick, viewed up close.','Original DAW-neutral synthetic waveform • not an Ableton Live screenshot',bg='#fff7ec')
fig,ax=plt.subplots();ax.plot(t*1000,freq,c='#ca5834',lw=4);ax.set(xlabel='Time (ms)',ylabel='Instantaneous frequency (Hz)',xlim=(0,180));finish(fig,K,'pitch-decay','Pitch falls. Impact remains.','Synthetic trajectory: 50 + 125 × exp(−time / 16 ms) • starting point, not a preset',bg='#fff7ed')
fig,ax=plt.subplots();ax.plot(t*1000,amp,c='#30639d',lw=4);ax.fill_between(t*1000,amp,alpha=.12,color='#30639d');ax.set(xlabel='Time (ms)',ylabel='Amplitude envelope',xlim=(0,360),ylim=(0,1.05));finish(fig,K,'amplitude-decay','The tail is an arrangement decision.','A smooth onset and exponential decay • synthetic amplitude envelope',bg='#edf4fa')
fig,axes=plt.subplots(2,1);q=np.linspace(0,.06,1200)
for ax,offset,title in zip(axes,[0,np.pi],['Aligned 50 Hz sine waves','Opposite polarity at the same frequency']):
 a=np.sin(2*np.pi*50*q);b=np.sin(2*np.pi*50*q+offset);ax.plot(q*1000,a,c='#2764a4',lw=2,label='A');ax.plot(q*1000,b,c='#c25285',lw=2,ls='--',label='B');ax.plot(q*1000,a+b,c='#202a35',lw=1.5,label='Sum');ax.set_title(title,loc='left',fontsize=14);ax.set_ylim(-2.4,2.4);ax.legend(loc='upper right',frameon=False,ncol=3)
axes[-1].set_xlabel('Time (ms)');finish(fig,K,'phase-example','Overlap changes the sum.','Pure sine illustration only • a moving-pitch kick is more complex',bg='#f7f2f7')
fig,ax=plt.subplots();
for d,c,l in zip([.045,.085,.16],COLORS,['Shorter','Medium','Longer']):ax.plot(t*1000,np.exp(-t/d),lw=3,c=c,label=l)
ax.set(xlabel='Time (ms)',ylabel='Relative tail amplitude',xlim=(0,360));ax.legend(frameon=False);finish(fig,K,'tail-lengths','Compare decay in the groove.','Synthetic decay alternatives • no fixed genre-to-duration rule',bg='#f2f6ef')
mods=[('OSCILLATOR','sound source',.1,4.3),('FILTER','shape harmonics',3.4,4.3),('VCA','control amplitude',6.7,4.3),('OUTPUT','listen / record',9.8,4.3),('ADSR','note contour',3.4,1),('LFO','slow movement',.1,1)]
flow(M,'featured','Build an instrument with connections.','Original modular patch schematic • audio in orange; control voltage in blue and violet',mods,[(0,1,'audio','#e2603e'),(1,2,'audio','#e2603e'),(2,3,'audio','#e2603e'),(4,2,'level CV','#2764a4'),(5,1,'cutoff CV','#a34f99')],bg='#edf0fa')
flow(M,'audio-routing','First, connect the sound.','Steps 3–6 • oscillator → filter → VCA → output • original schematic',mods[:4],[(0,1,'audio','#e2603e'),(1,2,'audio','#e2603e'),(2,3,'audio','#e2603e')],bg='#fff6ed')
flow(M,'control-routing','Then, tell it when to play.','Steps 7–9 • pitch, gate, amplitude CV and filter modulation • original schematic',[('MIDI / KEYS','pitch + gate',.1,4.6),('OSCILLATOR','pitch input',4.6,4.6),('ADSR','gate input',4.6,1.3),('VCA','amplitude CV',9.4,1.3)],[(0,1,'pitch CV','#2764a4'),(0,2,'gate','#a34f99'),(2,3,'envelope','#27847d')],bg='#edf5f6')
fig,ax=plt.subplots();xx=[0,.15,.35,.7,1];yy=[0,1,.4,.4,0];ax.plot(xx,yy,c='#6654b4',lw=4);ax.fill_between(xx,yy,color='#6654b4',alpha=.12);ax.set(xlabel='Illustrative note timeline',ylabel='Envelope level',ylim=(0,1.2));
for xpos,label in [(.075,'ATTACK'),(.25,'DECAY'),(.525,'SUSTAIN'),(.85,'RELEASE')]:ax.text(xpos,1.1,label,ha='center',fontsize=12,color='#6654b4')
finish(fig,M,'adsr','Sustain is a level, not a duration.','Idealized ADSR contour • gate released at 70% of this example timeline',bg='#f5f0fb')
fig,axes=plt.subplots(2,2);q=np.linspace(0,2,1500)
for ax,y,c,label in zip(axes.flat,[np.sin(2*np.pi*q),2*(q%1)-1,np.where(q%1<.5,1,-1),2*np.abs(2*(q%1)-1)-1],COLORS,['Sine','Saw','Square','Triangle']):ax.plot(q,y,c=c,lw=2.5);ax.set_title(label,loc='left',fontweight='bold');ax.set(ylim=(-1.3,1.3),xlabel='Cycles',ylabel='Amplitude')
finish(fig,M,'wave-shapes','One oscillator. Different harmonic starting points.','Ideal mathematical waveforms • not sampled plugin output',bg='#fbf9f2')
# Individual imagery for the five protected draft articles, with distinct visual subjects.
for slug,source in [('how-to-make-a-psytrance-kick',ROOT/K/'pitch-decay.webp'),('kick-bass-phase-alignment',ROOT/K/'phase-example.webp'),('best-free-vst-plugins-edm',ROOT/F/'toolkit-flow.webp'),('kick-synthesizer-vs-samples',ROOT/K/'tail-lengths.webp'),('compress-drums-without-losing-punch',ROOT/C/'timing-envelope.webp')]:
 p=ROOT/slug/'featured.webp';p.parent.mkdir(parents=True,exist_ok=True);Image.open(source).save(p,quality=95,method=6);made.append(str(p))
print('Created',len(made),'original WebP teaching visuals.');
# Genuine interface images retain their native colors; no overlay, no fake controls.
font='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
def label(draw,xy,text,size=22,fill='#29313b'):
 draw.text(xy,text,font=ImageFont.truetype(font,size),fill=fill)
def paste_contained(canvas,src,box):
 im=Image.open(src).convert('RGB');im.thumbnail((box[2]-box[0],box[3]-box[1]),Image.Resampling.LANCZOS);canvas.paste(im,(box[0]+(box[2]-box[0]-im.width)//2,box[1]+(box[3]-box[1]-im.height)//2))
canvas=Image.new('RGB',(1200,675),'#e8edf3');draw=ImageDraw.Draw(canvas)
label(draw,(42,45),'COMPRESSION',20,'#596b83');label(draw,(42,245),'FabFilter',35);label(draw,(42,294),'Pro-C 3',48);label(draw,(42,370),'Real interface.',20);label(draw,(42,400),'Official press image.',20)
paste_contained(canvas,ROOT/C/'pro-c-3-press.webp',(355,20,1180,650));canvas.save(ROOT/C/'featured.webp',quality=96,method=6)
canvas=Image.new('RGB',(1200,675),'#f8debd');draw=ImageDraw.Draw(canvas)
label(draw,(38,25),'FREE TOOLS / TWO DIFFERENT WORLDS',22,'#593f45')
paste_contained(canvas,ROOT/F/'surge-xt.webp',(20,90,790,585));paste_contained(canvas,ROOT/F/'dragonfly-hall.webp',(760,165,1190,560))
label(draw,(45,620),'Surge XT  +  Dragonfly Hall Reverb',24,'#593f45');canvas.save(ROOT/F/'featured.webp',quality=96,method=6)
