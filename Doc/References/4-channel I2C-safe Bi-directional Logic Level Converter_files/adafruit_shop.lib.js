+function($){'use strict';var Collapse=function(element,options){this.$element=$(element)
this.options=$.extend({},Collapse.DEFAULTS,options)
this.transitioning=null
if(this.options.parent)this.$parent=$(this.options.parent)
if(this.options.toggle)this.toggle()}
Collapse.DEFAULTS={toggle:true}
Collapse.prototype.dimension=function(){var hasWidth=this.$element.hasClass('width')
return hasWidth?'width':'height'}
Collapse.prototype.show=function(){if(this.transitioning||this.$element.hasClass('in'))return
var startEvent=$.Event('show.bs.collapse')
this.$element.trigger(startEvent)
if(startEvent.isDefaultPrevented())return
var actives=this.$parent&&this.$parent.find('> .panel > .in')
if(actives&&actives.length){var hasData=actives.data('bs.collapse')
if(hasData&&hasData.transitioning)return
actives.collapse('hide')
hasData||actives.data('bs.collapse',null)}
var dimension=this.dimension()
this.$element.removeClass('collapse').addClass('collapsing')
[dimension](0)
this.transitioning=1
var complete=function(){this.$element.removeClass('collapsing').addClass('collapse in')
[dimension]('auto')
this.transitioning=0
this.$element.trigger('shown.bs.collapse')}
if(!$.support.transition)return complete.call(this)
var scrollSize=$.camelCase(['scroll',dimension].join('-'))
this.$element.one($.support.transition.end,$.proxy(complete,this)).emulateTransitionEnd(350)
[dimension](this.$element[0][scrollSize])}
Collapse.prototype.hide=function(){if(this.transitioning||!this.$element.hasClass('in'))return
var startEvent=$.Event('hide.bs.collapse')
this.$element.trigger(startEvent)
if(startEvent.isDefaultPrevented())return
var dimension=this.dimension()
this.$element
[dimension](this.$element[dimension]())
[0].offsetHeight
this.$element.addClass('collapsing').removeClass('collapse').removeClass('in')
this.transitioning=1
var complete=function(){this.transitioning=0
this.$element.trigger('hidden.bs.collapse').removeClass('collapsing').addClass('collapse')}
if(!$.support.transition)return complete.call(this)
this.$element
[dimension](0).one($.support.transition.end,$.proxy(complete,this)).emulateTransitionEnd(350)}
Collapse.prototype.toggle=function(){this[this.$element.hasClass('in')?'hide':'show']()}
var old=$.fn.collapse
$.fn.collapse=function(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.collapse')
var options=$.extend({},Collapse.DEFAULTS,$this.data(),typeof option=='object'&&option)
if(!data&&options.toggle&&option=='show')option=!option
if(!data)$this.data('bs.collapse',(data=new Collapse(this,options)))
if(typeof option=='string')data[option]()})}
$.fn.collapse.Constructor=Collapse
$.fn.collapse.noConflict=function(){$.fn.collapse=old
return this}
$(document).on('click.bs.collapse.data-api','[data-toggle=collapse]',function(e){var $this=$(this),href
var target=$this.attr('data-target')||e.preventDefault()||(href=$this.attr('href'))&&href.replace(/.*(?=#[^\s]+$)/,'')
var $target=$(target)
var data=$target.data('bs.collapse')
var option=data?'toggle':$this.data()
var parent=$this.attr('data-parent')
var $parent=parent&&$(parent)
if(!data||!data.transitioning){if($parent)$parent.find('[data-toggle=collapse][data-parent="'+parent+'"]').not($this).addClass('collapsed')
$this[$target.hasClass('in')?'addClass':'removeClass']('collapsed')}
$target.collapse(option)})}(jQuery);+function($){'use strict';var Modal=function(element,options){this.options=options
this.$element=$(element)
this.$backdrop=this.isShown=null
if(this.options.remote){this.$element.find('.modal-content').load(this.options.remote,$.proxy(function(){this.$element.trigger('loaded.bs.modal')},this))}}
Modal.DEFAULTS={backdrop:true,keyboard:true,show:true}
Modal.prototype.toggle=function(_relatedTarget){return this[!this.isShown?'show':'hide'](_relatedTarget)}
Modal.prototype.show=function(_relatedTarget){var that=this
var e=$.Event('show.bs.modal',{relatedTarget:_relatedTarget})
this.$element.trigger(e)
if(this.isShown||e.isDefaultPrevented())return
this.isShown=true
this.escape()
this.$element.on('click.dismiss.bs.modal','[data-dismiss="modal"]',$.proxy(this.hide,this))
this.backdrop(function(){var transition=$.support.transition&&that.$element.hasClass('fade')
if(!that.$element.parent().length){that.$element.appendTo(document.body)}
that.$element.show().scrollTop(0)
if(transition){that.$element[0].offsetWidth}
that.$element.addClass('in').attr('aria-hidden',false)
that.enforceFocus()
var e=$.Event('shown.bs.modal',{relatedTarget:_relatedTarget})
transition?that.$element.find('.modal-dialog').one($.support.transition.end,function(){that.$element.focus().trigger(e)}).emulateTransitionEnd(300):that.$element.focus().trigger(e)})}
Modal.prototype.hide=function(e){if(e)e.preventDefault()
e=$.Event('hide.bs.modal')
this.$element.trigger(e)
if(!this.isShown||e.isDefaultPrevented())return
this.isShown=false
this.escape()
$(document).off('focusin.bs.modal')
this.$element.removeClass('in').attr('aria-hidden',true).off('click.dismiss.bs.modal')
$.support.transition&&this.$element.hasClass('fade')?this.$element.one($.support.transition.end,$.proxy(this.hideModal,this)).emulateTransitionEnd(300):this.hideModal()}
Modal.prototype.enforceFocus=function(){$(document).off('focusin.bs.modal').on('focusin.bs.modal',$.proxy(function(e){if(this.$element[0]!==e.target&&!this.$element.has(e.target).length){this.$element.focus()}},this))}
Modal.prototype.escape=function(){if(this.isShown&&this.options.keyboard){this.$element.on('keyup.dismiss.bs.modal',$.proxy(function(e){e.which==27&&this.hide()},this))}else if(!this.isShown){this.$element.off('keyup.dismiss.bs.modal')}}
Modal.prototype.hideModal=function(){var that=this
this.$element.hide()
this.backdrop(function(){that.removeBackdrop()
that.$element.trigger('hidden.bs.modal')})}
Modal.prototype.removeBackdrop=function(){this.$backdrop&&this.$backdrop.remove()
this.$backdrop=null}
Modal.prototype.backdrop=function(callback){var animate=this.$element.hasClass('fade')?'fade':''
if(this.isShown&&this.options.backdrop){var doAnimate=$.support.transition&&animate
this.$backdrop=$('<div class="modal-backdrop '+animate+'" />').appendTo(document.body)
this.$element.on('click.dismiss.bs.modal',$.proxy(function(e){if(e.target!==e.currentTarget)return
this.options.backdrop=='static'?this.$element[0].focus.call(this.$element[0]):this.hide.call(this)},this))
if(doAnimate)this.$backdrop[0].offsetWidth
this.$backdrop.addClass('in')
if(!callback)return
doAnimate?this.$backdrop.one($.support.transition.end,callback).emulateTransitionEnd(150):callback()}else if(!this.isShown&&this.$backdrop){this.$backdrop.removeClass('in')
$.support.transition&&this.$element.hasClass('fade')?this.$backdrop.one($.support.transition.end,callback).emulateTransitionEnd(150):callback()}else if(callback){callback()}}
var old=$.fn.modal
$.fn.modal=function(option,_relatedTarget){return this.each(function(){var $this=$(this)
var data=$this.data('bs.modal')
var options=$.extend({},Modal.DEFAULTS,$this.data(),typeof option=='object'&&option)
if(!data)$this.data('bs.modal',(data=new Modal(this,options)))
if(typeof option=='string')data[option](_relatedTarget)
else if(options.show)data.show(_relatedTarget)})}
$.fn.modal.Constructor=Modal
$.fn.modal.noConflict=function(){$.fn.modal=old
return this}
$(document).on('click.bs.modal.data-api','[data-toggle="modal"]',function(e){var $this=$(this)
var href=$this.attr('href')
var $target=$($this.attr('data-target')||(href&&href.replace(/.*(?=#[^\s]+$)/,'')))
var option=$target.data('bs.modal')?'toggle':$.extend({remote:!/#/.test(href)&&href},$target.data(),$this.data())
if($this.is('a'))e.preventDefault()
$target.modal(option,this).one('hide',function(){$this.is(':visible')&&$this.focus()})})
$(document).on('show.bs.modal','.modal',function(){$(document.body).addClass('modal-open')}).on('hidden.bs.modal','.modal',function(){$(document.body).removeClass('modal-open')})}(jQuery);+function($){'use strict';function ScrollSpy(element,options){var href
var process=$.proxy(this.process,this)
this.$element=$(element).is('body')?$(window):$(element)
this.$body=$('body')
this.$scrollElement=this.$element.on('scroll.bs.scroll-spy.data-api',process)
this.options=$.extend({},ScrollSpy.DEFAULTS,options)
this.selector=(this.options.target||((href=$(element).attr('href'))&&href.replace(/.*(?=#[^\s]+$)/,''))||'')+' .nav li > a'
this.offsets=$([])
this.targets=$([])
this.activeTarget=null
this.refresh()
this.process()}
ScrollSpy.DEFAULTS={offset:10}
ScrollSpy.prototype.refresh=function(){var offsetMethod=this.$element[0]==window?'offset':'position'
this.offsets=$([])
this.targets=$([])
var self=this
var $targets=this.$body.find(this.selector).map(function(){var $el=$(this)
var href=$el.data('target')||$el.attr('href')
var $href=/^#./.test(href)&&$(href)
return($href&&$href.length&&$href.is(':visible')&&[[$href[offsetMethod]().top+(!$.isWindow(self.$scrollElement.get(0))&&self.$scrollElement.scrollTop()),href]])||null}).sort(function(a,b){return a[0]-b[0]}).each(function(){self.offsets.push(this[0])
self.targets.push(this[1])})}
ScrollSpy.prototype.process=function(){var scrollTop=this.$scrollElement.scrollTop()+this.options.offset
var scrollHeight=this.$scrollElement[0].scrollHeight||this.$body[0].scrollHeight
var maxScroll=scrollHeight-this.$scrollElement.height()
var offsets=this.offsets
var targets=this.targets
var activeTarget=this.activeTarget
var i
if(scrollTop>=maxScroll){return activeTarget!=(i=targets.last()[0])&&this.activate(i)}
if(activeTarget&&scrollTop<=offsets[0]){return activeTarget!=(i=targets[0])&&this.activate(i)}
for(i=offsets.length;i--;){activeTarget!=targets[i]&&scrollTop>=offsets[i]&&(!offsets[i+1]||scrollTop<=offsets[i+1])&&this.activate(targets[i])}}
ScrollSpy.prototype.activate=function(target){this.activeTarget=target
$(this.selector).parentsUntil(this.options.target,'.active').removeClass('active')
var selector=this.selector+
'[data-target="'+target+'"],'+
this.selector+'[href="'+target+'"]'
var active=$(selector).parents('li').addClass('active')
if(active.parent('.dropdown-menu').length){active=active.closest('li.dropdown').addClass('active')}
active.trigger('activate.bs.scrollspy')}
var old=$.fn.scrollspy
$.fn.scrollspy=function(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.scrollspy')
var options=typeof option=='object'&&option
if(!data)$this.data('bs.scrollspy',(data=new ScrollSpy(this,options)))
if(typeof option=='string')data[option]()})}
$.fn.scrollspy.Constructor=ScrollSpy
$.fn.scrollspy.noConflict=function(){$.fn.scrollspy=old
return this}
$(window).on('load',function(){$('[data-spy="scroll"]').each(function(){var $spy=$(this)
$spy.scrollspy($spy.data())})})}(jQuery);+function($){'use strict';var Tooltip=function(element,options){this.type=this.options=this.enabled=this.timeout=this.hoverState=this.$element=null
this.init('tooltip',element,options)}
Tooltip.DEFAULTS={animation:true,placement:'top',selector:false,template:'<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:'hover focus',title:'',delay:0,html:false,container:false}
Tooltip.prototype.init=function(type,element,options){this.enabled=true
this.type=type
this.$element=$(element)
this.options=this.getOptions(options)
var triggers=this.options.trigger.split(' ')
for(var i=triggers.length;i--;){var trigger=triggers[i]
if(trigger=='click'){this.$element.on('click.'+this.type,this.options.selector,$.proxy(this.toggle,this))}else if(trigger!='manual'){var eventIn=trigger=='hover'?'mouseenter':'focusin'
var eventOut=trigger=='hover'?'mouseleave':'focusout'
this.$element.on(eventIn+'.'+this.type,this.options.selector,$.proxy(this.enter,this))
this.$element.on(eventOut+'.'+this.type,this.options.selector,$.proxy(this.leave,this))}}
this.options.selector?(this._options=$.extend({},this.options,{trigger:'manual',selector:''})):this.fixTitle()}
Tooltip.prototype.getDefaults=function(){return Tooltip.DEFAULTS}
Tooltip.prototype.getOptions=function(options){options=$.extend({},this.getDefaults(),this.$element.data(),options)
if(options.delay&&typeof options.delay=='number'){options.delay={show:options.delay,hide:options.delay}}
return options}
Tooltip.prototype.getDelegateOptions=function(){var options={}
var defaults=this.getDefaults()
this._options&&$.each(this._options,function(key,value){if(defaults[key]!=value)options[key]=value})
return options}
Tooltip.prototype.enter=function(obj){var self=obj instanceof this.constructor?obj:$(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.'+this.type)
clearTimeout(self.timeout)
self.hoverState='in'
if(!self.options.delay||!self.options.delay.show)return self.show()
self.timeout=setTimeout(function(){if(self.hoverState=='in')self.show()},self.options.delay.show)}
Tooltip.prototype.leave=function(obj){var self=obj instanceof this.constructor?obj:$(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.'+this.type)
clearTimeout(self.timeout)
self.hoverState='out'
if(!self.options.delay||!self.options.delay.hide)return self.hide()
self.timeout=setTimeout(function(){if(self.hoverState=='out')self.hide()},self.options.delay.hide)}
Tooltip.prototype.show=function(){var e=$.Event('show.bs.'+this.type)
if(this.hasContent()&&this.enabled){this.$element.trigger(e)
if(e.isDefaultPrevented())return
var that=this;var $tip=this.tip()
this.setContent()
if(this.options.animation)$tip.addClass('fade')
var placement=typeof this.options.placement=='function'?this.options.placement.call(this,$tip[0],this.$element[0]):this.options.placement
var autoToken=/\s?auto?\s?/i
var autoPlace=autoToken.test(placement)
if(autoPlace)placement=placement.replace(autoToken,'')||'top'
$tip.detach().css({top:0,left:0,display:'block'}).addClass(placement)
this.options.container?$tip.appendTo(this.options.container):$tip.insertAfter(this.$element)
var pos=this.getPosition()
var actualWidth=$tip[0].offsetWidth
var actualHeight=$tip[0].offsetHeight
if(autoPlace){var $parent=this.$element.parent()
var orgPlacement=placement
var docScroll=document.documentElement.scrollTop||document.body.scrollTop
var parentWidth=this.options.container=='body'?window.innerWidth:$parent.outerWidth()
var parentHeight=this.options.container=='body'?window.innerHeight:$parent.outerHeight()
var parentLeft=this.options.container=='body'?0:$parent.offset().left
placement=placement=='bottom'&&pos.top+pos.height+actualHeight-docScroll>parentHeight?'top':placement=='top'&&pos.top-docScroll-actualHeight<0?'bottom':placement=='right'&&pos.right+actualWidth>parentWidth?'left':placement=='left'&&pos.left-actualWidth<parentLeft?'right':placement
$tip.removeClass(orgPlacement).addClass(placement)}
var calculatedOffset=this.getCalculatedOffset(placement,pos,actualWidth,actualHeight)
this.applyPlacement(calculatedOffset,placement)
this.hoverState=null
var complete=function(){that.$element.trigger('shown.bs.'+that.type)}
$.support.transition&&this.$tip.hasClass('fade')?$tip.one($.support.transition.end,complete).emulateTransitionEnd(150):complete()}}
Tooltip.prototype.applyPlacement=function(offset,placement){var replace
var $tip=this.tip()
var width=$tip[0].offsetWidth
var height=$tip[0].offsetHeight
var marginTop=parseInt($tip.css('margin-top'),10)
var marginLeft=parseInt($tip.css('margin-left'),10)
if(isNaN(marginTop))marginTop=0
if(isNaN(marginLeft))marginLeft=0
offset.top=offset.top+marginTop
offset.left=offset.left+marginLeft
$.offset.setOffset($tip[0],$.extend({using:function(props){$tip.css({top:Math.round(props.top),left:Math.round(props.left)})}},offset),0)
$tip.addClass('in')
var actualWidth=$tip[0].offsetWidth
var actualHeight=$tip[0].offsetHeight
if(placement=='top'&&actualHeight!=height){replace=true
offset.top=offset.top+height-actualHeight}
if(/bottom|top/.test(placement)){var delta=0
if(offset.left<0){delta=offset.left*-2
offset.left=0
$tip.offset(offset)
actualWidth=$tip[0].offsetWidth
actualHeight=$tip[0].offsetHeight}
this.replaceArrow(delta-width+actualWidth,actualWidth,'left')}else{this.replaceArrow(actualHeight-height,actualHeight,'top')}
if(replace)$tip.offset(offset)}
Tooltip.prototype.replaceArrow=function(delta,dimension,position){this.arrow().css(position,delta?(50*(1-delta/dimension)+'%'):'')}
Tooltip.prototype.setContent=function(){var $tip=this.tip()
var title=this.getTitle()
$tip.find('.tooltip-inner')[this.options.html?'html':'text'](title)
$tip.removeClass('fade in top bottom left right')}
Tooltip.prototype.hide=function(){var that=this
var $tip=this.tip()
var e=$.Event('hide.bs.'+this.type)
function complete(){if(that.hoverState!='in')$tip.detach()
that.$element.trigger('hidden.bs.'+that.type)}
this.$element.trigger(e)
if(e.isDefaultPrevented())return
$tip.removeClass('in')
$.support.transition&&this.$tip.hasClass('fade')?$tip.one($.support.transition.end,complete).emulateTransitionEnd(150):complete()
this.hoverState=null
return this}
Tooltip.prototype.fixTitle=function(){var $e=this.$element
if($e.attr('title')||typeof($e.attr('data-original-title'))!='string'){$e.attr('data-original-title',$e.attr('title')||'').attr('title','')}}
Tooltip.prototype.hasContent=function(){return this.getTitle()}
Tooltip.prototype.getPosition=function(){var el=this.$element[0]
return $.extend({},(typeof el.getBoundingClientRect=='function')?el.getBoundingClientRect():{width:el.offsetWidth,height:el.offsetHeight},this.$element.offset())}
Tooltip.prototype.getCalculatedOffset=function(placement,pos,actualWidth,actualHeight){return placement=='bottom'?{top:pos.top+pos.height,left:pos.left+pos.width/2-actualWidth/2}:placement=='top'?{top:pos.top-actualHeight,left:pos.left+pos.width/2-actualWidth/2}:placement=='left'?{top:pos.top+pos.height/2-actualHeight/2,left:pos.left-actualWidth}:{top:pos.top+pos.height/2-actualHeight/2,left:pos.left+pos.width}}
Tooltip.prototype.getTitle=function(){var title
var $e=this.$element
var o=this.options
title=$e.attr('data-original-title')||(typeof o.title=='function'?o.title.call($e[0]):o.title)
return title}
Tooltip.prototype.tip=function(){return this.$tip=this.$tip||$(this.options.template)}
Tooltip.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find('.tooltip-arrow')}
Tooltip.prototype.validate=function(){if(!this.$element[0].parentNode){this.hide()
this.$element=null
this.options=null}}
Tooltip.prototype.enable=function(){this.enabled=true}
Tooltip.prototype.disable=function(){this.enabled=false}
Tooltip.prototype.toggleEnabled=function(){this.enabled=!this.enabled}
Tooltip.prototype.toggle=function(e){var self=e?$(e.currentTarget)[this.type](this.getDelegateOptions()).data('bs.'+this.type):this
self.tip().hasClass('in')?self.leave(self):self.enter(self)}
Tooltip.prototype.destroy=function(){clearTimeout(this.timeout)
this.hide().$element.off('.'+this.type).removeData('bs.'+this.type)}
var old=$.fn.tooltip
$.fn.tooltip=function(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.tooltip')
var options=typeof option=='object'&&option
if(!data&&option=='destroy')return
if(!data)$this.data('bs.tooltip',(data=new Tooltip(this,options)))
if(typeof option=='string')data[option]()})}
$.fn.tooltip.Constructor=Tooltip
$.fn.tooltip.noConflict=function(){$.fn.tooltip=old
return this}}(jQuery);+function($){'use strict';function transitionEnd(){var el=document.createElement('bootstrap')
var transEndEventNames={'WebkitTransition':'webkitTransitionEnd','MozTransition':'transitionend','OTransition':'oTransitionEnd otransitionend','transition':'transitionend'}
for(var name in transEndEventNames){if(el.style[name]!==undefined){return{end:transEndEventNames[name]}}}
return false}
$.fn.emulateTransitionEnd=function(duration){var called=false,$el=this
$(this).one($.support.transition.end,function(){called=true})
var callback=function(){if(!called)$($el).trigger($.support.transition.end)}
setTimeout(callback,duration)
return this}
$(function(){$.support.transition=transitionEnd()})}(jQuery);+function($){'use strict';var Popover=function(element,options){this.init('popover',element,options)}
if(!$.fn.tooltip)throw new Error('Popover requires tooltip.js')
Popover.DEFAULTS=$.extend({},$.fn.tooltip.Constructor.DEFAULTS,{placement:'right',trigger:'click',content:'',template:'<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'})
Popover.prototype=$.extend({},$.fn.tooltip.Constructor.prototype)
Popover.prototype.constructor=Popover
Popover.prototype.getDefaults=function(){return Popover.DEFAULTS}
Popover.prototype.setContent=function(){var $tip=this.tip()
var title=this.getTitle()
var content=this.getContent()
$tip.find('.popover-title')[this.options.html?'html':'text'](title)
$tip.find('.popover-content')[this.options.html?(typeof content=='string'?'html':'append'):'text'](content)
$tip.removeClass('fade top bottom left right in')
if(!$tip.find('.popover-title').html())$tip.find('.popover-title').hide()}
Popover.prototype.hasContent=function(){return this.getTitle()||this.getContent()}
Popover.prototype.getContent=function(){var $e=this.$element
var o=this.options
return $e.attr('data-content')||(typeof o.content=='function'?o.content.call($e[0]):o.content)}
Popover.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find('.arrow')}
Popover.prototype.tip=function(){if(!this.$tip)this.$tip=$(this.options.template)
return this.$tip}
var old=$.fn.popover
$.fn.popover=function(option){return this.each(function(){var $this=$(this)
var data=$this.data('bs.popover')
var options=typeof option=='object'&&option
if(!data&&option=='destroy')return
if(!data)$this.data('bs.popover',(data=new Popover(this,options)))
if(typeof option=='string')data[option]()})}
$.fn.popover.Constructor=Popover
$.fn.popover.noConflict=function(){$.fn.popover=old
return this}}(jQuery);(function(self){'use strict';if(self.fetch){return}
var support={searchParams:'URLSearchParams'in self,iterable:'Symbol'in self&&'iterator'in Symbol,blob:'FileReader'in self&&'Blob'in self&&(function(){try{new Blob()
return true}catch(e){return false}})(),formData:'FormData'in self,arrayBuffer:'ArrayBuffer'in self}
if(support.arrayBuffer){var viewClasses=['[object Int8Array]','[object Uint8Array]','[object Uint8ClampedArray]','[object Int16Array]','[object Uint16Array]','[object Int32Array]','[object Uint32Array]','[object Float32Array]','[object Float64Array]']
var isDataView=function(obj){return obj&&DataView.prototype.isPrototypeOf(obj)}
var isArrayBufferView=ArrayBuffer.isView||function(obj){return obj&&viewClasses.indexOf(Object.prototype.toString.call(obj))>-1}}
function normalizeName(name){if(typeof name!=='string'){name=String(name)}
if(/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)){throw new TypeError('Invalid character in header field name')}
return name.toLowerCase()}
function normalizeValue(value){if(typeof value!=='string'){value=String(value)}
return value}
function iteratorFor(items){var iterator={next:function(){var value=items.shift()
return{done:value===undefined,value:value}}}
if(support.iterable){iterator[Symbol.iterator]=function(){return iterator}}
return iterator}
function Headers(headers){this.map={}
if(headers instanceof Headers){headers.forEach(function(value,name){this.append(name,value)},this)}else if(Array.isArray(headers)){headers.forEach(function(header){this.append(header[0],header[1])},this)}else if(headers){Object.getOwnPropertyNames(headers).forEach(function(name){this.append(name,headers[name])},this)}}
Headers.prototype.append=function(name,value){name=normalizeName(name)
value=normalizeValue(value)
var oldValue=this.map[name]
this.map[name]=oldValue?oldValue+','+value:value}
Headers.prototype['delete']=function(name){delete this.map[normalizeName(name)]}
Headers.prototype.get=function(name){name=normalizeName(name)
return this.has(name)?this.map[name]:null}
Headers.prototype.has=function(name){return this.map.hasOwnProperty(normalizeName(name))}
Headers.prototype.set=function(name,value){this.map[normalizeName(name)]=normalizeValue(value)}
Headers.prototype.forEach=function(callback,thisArg){for(var name in this.map){if(this.map.hasOwnProperty(name)){callback.call(thisArg,this.map[name],name,this)}}}
Headers.prototype.keys=function(){var items=[]
this.forEach(function(value,name){items.push(name)})
return iteratorFor(items)}
Headers.prototype.values=function(){var items=[]
this.forEach(function(value){items.push(value)})
return iteratorFor(items)}
Headers.prototype.entries=function(){var items=[]
this.forEach(function(value,name){items.push([name,value])})
return iteratorFor(items)}
if(support.iterable){Headers.prototype[Symbol.iterator]=Headers.prototype.entries}
function consumed(body){if(body.bodyUsed){return Promise.reject(new TypeError('Already read'))}
body.bodyUsed=true}
function fileReaderReady(reader){return new Promise(function(resolve,reject){reader.onload=function(){resolve(reader.result)}
reader.onerror=function(){reject(reader.error)}})}
function readBlobAsArrayBuffer(blob){var reader=new FileReader()
var promise=fileReaderReady(reader)
reader.readAsArrayBuffer(blob)
return promise}
function readBlobAsText(blob){var reader=new FileReader()
var promise=fileReaderReady(reader)
reader.readAsText(blob)
return promise}
function readArrayBufferAsText(buf){var view=new Uint8Array(buf)
var chars=new Array(view.length)
for(var i=0;i<view.length;i++){chars[i]=String.fromCharCode(view[i])}
return chars.join('')}
function bufferClone(buf){if(buf.slice){return buf.slice(0)}else{var view=new Uint8Array(buf.byteLength)
view.set(new Uint8Array(buf))
return view.buffer}}
function Body(){this.bodyUsed=false
this._initBody=function(body){this._bodyInit=body
if(!body){this._bodyText=''}else if(typeof body==='string'){this._bodyText=body}else if(support.blob&&Blob.prototype.isPrototypeOf(body)){this._bodyBlob=body}else if(support.formData&&FormData.prototype.isPrototypeOf(body)){this._bodyFormData=body}else if(support.searchParams&&URLSearchParams.prototype.isPrototypeOf(body)){this._bodyText=body.toString()}else if(support.arrayBuffer&&support.blob&&isDataView(body)){this._bodyArrayBuffer=bufferClone(body.buffer)
this._bodyInit=new Blob([this._bodyArrayBuffer])}else if(support.arrayBuffer&&(ArrayBuffer.prototype.isPrototypeOf(body)||isArrayBufferView(body))){this._bodyArrayBuffer=bufferClone(body)}else{throw new Error('unsupported BodyInit type')}
if(!this.headers.get('content-type')){if(typeof body==='string'){this.headers.set('content-type','text/plain;charset=UTF-8')}else if(this._bodyBlob&&this._bodyBlob.type){this.headers.set('content-type',this._bodyBlob.type)}else if(support.searchParams&&URLSearchParams.prototype.isPrototypeOf(body)){this.headers.set('content-type','application/x-www-form-urlencoded;charset=UTF-8')}}}
if(support.blob){this.blob=function(){var rejected=consumed(this)
if(rejected){return rejected}
if(this._bodyBlob){return Promise.resolve(this._bodyBlob)}else if(this._bodyArrayBuffer){return Promise.resolve(new Blob([this._bodyArrayBuffer]))}else if(this._bodyFormData){throw new Error('could not read FormData body as blob')}else{return Promise.resolve(new Blob([this._bodyText]))}}
this.arrayBuffer=function(){if(this._bodyArrayBuffer){return consumed(this)||Promise.resolve(this._bodyArrayBuffer)}else{return this.blob().then(readBlobAsArrayBuffer)}}}
this.text=function(){var rejected=consumed(this)
if(rejected){return rejected}
if(this._bodyBlob){return readBlobAsText(this._bodyBlob)}else if(this._bodyArrayBuffer){return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))}else if(this._bodyFormData){throw new Error('could not read FormData body as text')}else{return Promise.resolve(this._bodyText)}}
if(support.formData){this.formData=function(){return this.text().then(decode)}}
this.json=function(){return this.text().then(JSON.parse)}
return this}
var methods=['DELETE','GET','HEAD','OPTIONS','POST','PUT']
function normalizeMethod(method){var upcased=method.toUpperCase()
return(methods.indexOf(upcased)>-1)?upcased:method}
function Request(input,options){options=options||{}
var body=options.body
if(input instanceof Request){if(input.bodyUsed){throw new TypeError('Already read')}
this.url=input.url
this.credentials=input.credentials
if(!options.headers){this.headers=new Headers(input.headers)}
this.method=input.method
this.mode=input.mode
if(!body&&input._bodyInit!=null){body=input._bodyInit
input.bodyUsed=true}}else{this.url=String(input)}
this.credentials=options.credentials||this.credentials||'omit'
if(options.headers||!this.headers){this.headers=new Headers(options.headers)}
this.method=normalizeMethod(options.method||this.method||'GET')
this.mode=options.mode||this.mode||null
this.referrer=null
if((this.method==='GET'||this.method==='HEAD')&&body){throw new TypeError('Body not allowed for GET or HEAD requests')}
this._initBody(body)}
Request.prototype.clone=function(){return new Request(this,{body:this._bodyInit})}
function decode(body){var form=new FormData()
body.trim().split('&').forEach(function(bytes){if(bytes){var split=bytes.split('=')
var name=split.shift().replace(/\+/g,' ')
var value=split.join('=').replace(/\+/g,' ')
form.append(decodeURIComponent(name),decodeURIComponent(value))}})
return form}
function parseHeaders(rawHeaders){var headers=new Headers()
var preProcessedHeaders=rawHeaders.replace(/\r?\n[\t ]+/g,' ')
preProcessedHeaders.split(/\r?\n/).forEach(function(line){var parts=line.split(':')
var key=parts.shift().trim()
if(key){var value=parts.join(':').trim()
headers.append(key,value)}})
return headers}
Body.call(Request.prototype)
function Response(bodyInit,options){if(!options){options={}}
this.type='default'
this.status=options.status===undefined?200:options.status
this.ok=this.status>=200&&this.status<300
this.statusText='statusText'in options?options.statusText:'OK'
this.headers=new Headers(options.headers)
this.url=options.url||''
this._initBody(bodyInit)}
Body.call(Response.prototype)
Response.prototype.clone=function(){return new Response(this._bodyInit,{status:this.status,statusText:this.statusText,headers:new Headers(this.headers),url:this.url})}
Response.error=function(){var response=new Response(null,{status:0,statusText:''})
response.type='error'
return response}
var redirectStatuses=[301,302,303,307,308]
Response.redirect=function(url,status){if(redirectStatuses.indexOf(status)===-1){throw new RangeError('Invalid status code')}
return new Response(null,{status:status,headers:{location:url}})}
self.Headers=Headers
self.Request=Request
self.Response=Response
self.fetch=function(input,init){return new Promise(function(resolve,reject){var request=new Request(input,init)
var xhr=new XMLHttpRequest()
xhr.onload=function(){var options={status:xhr.status,statusText:xhr.statusText,headers:parseHeaders(xhr.getAllResponseHeaders()||'')}
options.url='responseURL'in xhr?xhr.responseURL:options.headers.get('X-Request-URL')
var body='response'in xhr?xhr.response:xhr.responseText
resolve(new Response(body,options))}
xhr.onerror=function(){reject(new TypeError('Network request failed'))}
xhr.ontimeout=function(){reject(new TypeError('Network request failed'))}
xhr.open(request.method,request.url,true)
if(request.credentials==='include'){xhr.withCredentials=true}else if(request.credentials==='omit'){xhr.withCredentials=false}
if('responseType'in xhr&&support.blob){xhr.responseType='blob'}
request.headers.forEach(function(value,name){xhr.setRequestHeader(name,value)})
xhr.send(typeof request._bodyInit==='undefined'?null:request._bodyInit)})}
self.fetch.polyfill=true})(typeof self!=='undefined'?self:this);(function webpackUniversalModuleDefinition(root,factory){if(typeof exports==='object'&&typeof module==='object')
module.exports=factory();else if(typeof define==='function'&&define.amd)
define([],factory);else if(typeof exports==='object')
exports["Handlebars"]=factory();else
root["Handlebars"]=factory();})(this,function(){return(function(modules){var installedModules={};function __webpack_require__(moduleId){if(installedModules[moduleId])
return installedModules[moduleId].exports;var module=installedModules[moduleId]={exports:{},id:moduleId,loaded:false};modules[moduleId].call(module.exports,module,module.exports,__webpack_require__);module.loaded=true;return module.exports;}
__webpack_require__.m=modules;__webpack_require__.c=installedModules;__webpack_require__.p="";return __webpack_require__(0);})
([(function(module,exports,__webpack_require__){'use strict';var _interopRequireDefault=__webpack_require__(1)['default'];exports.__esModule=true;var _handlebarsRuntime=__webpack_require__(2);var _handlebarsRuntime2=_interopRequireDefault(_handlebarsRuntime);var _handlebarsCompilerAst=__webpack_require__(35);var _handlebarsCompilerAst2=_interopRequireDefault(_handlebarsCompilerAst);var _handlebarsCompilerBase=__webpack_require__(36);var _handlebarsCompilerCompiler=__webpack_require__(41);var _handlebarsCompilerJavascriptCompiler=__webpack_require__(42);var _handlebarsCompilerJavascriptCompiler2=_interopRequireDefault(_handlebarsCompilerJavascriptCompiler);var _handlebarsCompilerVisitor=__webpack_require__(39);var _handlebarsCompilerVisitor2=_interopRequireDefault(_handlebarsCompilerVisitor);var _handlebarsNoConflict=__webpack_require__(34);var _handlebarsNoConflict2=_interopRequireDefault(_handlebarsNoConflict);var _create=_handlebarsRuntime2['default'].create;function create(){var hb=_create();hb.compile=function(input,options){return _handlebarsCompilerCompiler.compile(input,options,hb);};hb.precompile=function(input,options){return _handlebarsCompilerCompiler.precompile(input,options,hb);};hb.AST=_handlebarsCompilerAst2['default'];hb.Compiler=_handlebarsCompilerCompiler.Compiler;hb.JavaScriptCompiler=_handlebarsCompilerJavascriptCompiler2['default'];hb.Parser=_handlebarsCompilerBase.parser;hb.parse=_handlebarsCompilerBase.parse;return hb;}
var inst=create();inst.create=create;_handlebarsNoConflict2['default'](inst);inst.Visitor=_handlebarsCompilerVisitor2['default'];inst['default']=inst;exports['default']=inst;module.exports=exports['default'];}),(function(module,exports){"use strict";exports["default"]=function(obj){return obj&&obj.__esModule?obj:{"default":obj};};exports.__esModule=true;}),(function(module,exports,__webpack_require__){'use strict';var _interopRequireWildcard=__webpack_require__(3)['default'];var _interopRequireDefault=__webpack_require__(1)['default'];exports.__esModule=true;var _handlebarsBase=__webpack_require__(4);var base=_interopRequireWildcard(_handlebarsBase);var _handlebarsSafeString=__webpack_require__(21);var _handlebarsSafeString2=_interopRequireDefault(_handlebarsSafeString);var _handlebarsException=__webpack_require__(6);var _handlebarsException2=_interopRequireDefault(_handlebarsException);var _handlebarsUtils=__webpack_require__(5);var Utils=_interopRequireWildcard(_handlebarsUtils);var _handlebarsRuntime=__webpack_require__(22);var runtime=_interopRequireWildcard(_handlebarsRuntime);var _handlebarsNoConflict=__webpack_require__(34);var _handlebarsNoConflict2=_interopRequireDefault(_handlebarsNoConflict);function create(){var hb=new base.HandlebarsEnvironment();Utils.extend(hb,base);hb.SafeString=_handlebarsSafeString2['default'];hb.Exception=_handlebarsException2['default'];hb.Utils=Utils;hb.escapeExpression=Utils.escapeExpression;hb.VM=runtime;hb.template=function(spec){return runtime.template(spec,hb);};return hb;}
var inst=create();inst.create=create;_handlebarsNoConflict2['default'](inst);inst['default']=inst;exports['default']=inst;module.exports=exports['default'];}),(function(module,exports){"use strict";exports["default"]=function(obj){if(obj&&obj.__esModule){return obj;}else{var newObj={};if(obj!=null){for(var key in obj){if(Object.prototype.hasOwnProperty.call(obj,key))newObj[key]=obj[key];}}
newObj["default"]=obj;return newObj;}};exports.__esModule=true;}),(function(module,exports,__webpack_require__){'use strict';var _interopRequireDefault=__webpack_require__(1)['default'];exports.__esModule=true;exports.HandlebarsEnvironment=HandlebarsEnvironment;var _utils=__webpack_require__(5);var _exception=__webpack_require__(6);var _exception2=_interopRequireDefault(_exception);var _helpers=__webpack_require__(10);var _decorators=__webpack_require__(18);var _logger=__webpack_require__(20);var _logger2=_interopRequireDefault(_logger);var VERSION='4.0.11';exports.VERSION=VERSION;var COMPILER_REVISION=7;exports.COMPILER_REVISION=COMPILER_REVISION;var REVISION_CHANGES={1:'<= 1.0.rc.2',2:'== 1.0.0-rc.3',3:'== 1.0.0-rc.4',4:'== 1.x.x',5:'== 2.0.0-alpha.x',6:'>= 2.0.0-beta.1',7:'>= 4.0.0'};exports.REVISION_CHANGES=REVISION_CHANGES;var objectType='[object Object]';function HandlebarsEnvironment(helpers,partials,decorators){this.helpers=helpers||{};this.partials=partials||{};this.decorators=decorators||{};_helpers.registerDefaultHelpers(this);_decorators.registerDefaultDecorators(this);}
HandlebarsEnvironment.prototype={constructor:HandlebarsEnvironment,logger:_logger2['default'],log:_logger2['default'].log,registerHelper:function registerHelper(name,fn){if(_utils.toString.call(name)===objectType){if(fn){throw new _exception2['default']('Arg not supported with multiple helpers');}
_utils.extend(this.helpers,name);}else{this.helpers[name]=fn;}},unregisterHelper:function unregisterHelper(name){delete this.helpers[name];},registerPartial:function registerPartial(name,partial){if(_utils.toString.call(name)===objectType){_utils.extend(this.partials,name);}else{if(typeof partial==='undefined'){throw new _exception2['default']('Attempting to register a partial called "'+name+'" as undefined');}
this.partials[name]=partial;}},unregisterPartial:function unregisterPartial(name){delete this.partials[name];},registerDecorator:function registerDecorator(name,fn){if(_utils.toString.call(name)===objectType){if(fn){throw new _exception2['default']('Arg not supported with multiple decorators');}
_utils.extend(this.decorators,name);}else{this.decorators[name]=fn;}},unregisterDecorator:function unregisterDecorator(name){delete this.decorators[name];}};var log=_logger2['default'].log;exports.log=log;exports.createFrame=_utils.createFrame;exports.logger=_logger2['default'];}),(function(module,exports){'use strict';exports.__esModule=true;exports.extend=extend;exports.indexOf=indexOf;exports.escapeExpression=escapeExpression;exports.isEmpty=isEmpty;exports.createFrame=createFrame;exports.blockParams=blockParams;exports.appendContextPath=appendContextPath;var escape={'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#x27;','`':'&#x60;','=':'&#x3D;'};var badChars=/[&<>"'`=]/g,possible=/[&<>"'`=]/;function escapeChar(chr){return escape[chr];}
function extend(obj){for(var i=1;i<arguments.length;i++){for(var key in arguments[i]){if(Object.prototype.hasOwnProperty.call(arguments[i],key)){obj[key]=arguments[i][key];}}}
return obj;}
var toString=Object.prototype.toString;exports.toString=toString;var isFunction=function isFunction(value){return typeof value==='function';};if(isFunction(/x/)){exports.isFunction=isFunction=function(value){return typeof value==='function'&&toString.call(value)==='[object Function]';};}
exports.isFunction=isFunction;var isArray=Array.isArray||function(value){return value&&typeof value==='object'?toString.call(value)==='[object Array]':false;};exports.isArray=isArray;function indexOf(array,value){for(var i=0,len=array.length;i<len;i++){if(array[i]===value){return i;}}
return-1;}
function escapeExpression(string){if(typeof string!=='string'){if(string&&string.toHTML){return string.toHTML();}else if(string==null){return '';}else if(!string){return string+'';}
string=''+string;}
if(!possible.test(string)){return string;}
return string.replace(badChars,escapeChar);}
function isEmpty(value){if(!value&&value!==0){return true;}else if(isArray(value)&&value.length===0){return true;}else{return false;}}
function createFrame(object){var frame=extend({},object);frame._parent=object;return frame;}
function blockParams(params,ids){params.path=ids;return params;}
function appendContextPath(contextPath,id){return(contextPath?contextPath+'.':'')+id;}}),(function(module,exports,__webpack_require__){'use strict';var _Object$defineProperty=__webpack_require__(7)['default'];exports.__esModule=true;var errorProps=['description','fileName','lineNumber','message','name','number','stack'];function Exception(message,node){var loc=node&&node.loc,line=undefined,column=undefined;if(loc){line=loc.start.line;column=loc.start.column;message+=' - '+line+':'+column;}
var tmp=Error.prototype.constructor.call(this,message);for(var idx=0;idx<errorProps.length;idx++){this[errorProps[idx]]=tmp[errorProps[idx]];}
if(Error.captureStackTrace){Error.captureStackTrace(this,Exception);}
try{if(loc){this.lineNumber=line;if(_Object$defineProperty){Object.defineProperty(this,'column',{value:column,enumerable:true});}else{this.column=column;}}}catch(nop){}}
Exception.prototype=new Error();exports['default']=Exception;module.exports=exports['default'];}),(function(module,exports,__webpack_require__){module.exports={"default":__webpack_require__(8),__esModule:true};}),(function(module,exports,__webpack_require__){var $=__webpack_require__(9);module.exports=function defineProperty(it,key,desc){return $.setDesc(it,key,desc);};}),(function(module,exports){var $Object=Object;module.exports={create:$Object.create,getProto:$Object.getPrototypeOf,isEnum:{}.propertyIsEnumerable,getDesc:$Object.getOwnPropertyDescriptor,setDesc:$Object.defineProperty,setDescs:$Object.defineProperties,getKeys:$Object.keys,getNames:$Object.getOwnPropertyNames,getSymbols:$Object.getOwnPropertySymbols,each:[].forEach};}),(function(module,exports,__webpack_require__){'use strict';var _interopRequireDefault=__webpack_require__(1)['default'];exports.__esModule=true;exports.registerDefaultHelpers=registerDefaultHelpers;var _helpersBlockHelperMissing=__webpack_require__(11);var _helpersBlockHelperMissing2=_interopRequireDefault(_helpersBlockHelperMissing);var _helpersEach=__webpack_require__(12);var _helpersEach2=_interopRequireDefault(_helpersEach);var _helpersHelperMissing=__webpack_require__(13);var _helpersHelperMissing2=_interopRequireDefault(_helpersHelperMissing);var _helpersIf=__webpack_require__(14);var _helpersIf2=_interopRequireDefault(_helpersIf);var _helpersLog=__webpack_require__(15);var _helpersLog2=_interopRequireDefault(_helpersLog);var _helpersLookup=__webpack_require__(16);var _helpersLookup2=_interopRequireDefault(_helpersLookup);var _helpersWith=__webpack_require__(17);var _helpersWith2=_interopRequireDefault(_helpersWith);function registerDefaultHelpers(instance){_helpersBlockHelperMissing2['default'](instance);_helpersEach2['default'](instance);_helpersHelperMissing2['default'](instance);_helpersIf2['default'](instance);_helpersLog2['default'](instance);_helpersLookup2['default'](instance);_helpersWith2['default'](instance);}}),(function(module,exports,__webpack_require__){'use strict';exports.__esModule=true;var _utils=__webpack_require__(5);exports['default']=function(instance){instance.registerHelper('blockHelperMissing',function(context,options){var inverse=options.inverse,fn=options.fn;if(context===true){return fn(this);}else if(context===false||context==null){return inverse(this);}else if(_utils.isArray(context)){if(context.length>0){if(options.ids){options.ids=[options.name];}
return instance.helpers.each(context,options);}else{return inverse(this);}}else{if(options.data&&options.ids){var data=_utils.createFrame(options.data);data.contextPath=_utils.appendContextPath(options.data.contextPath,options.name);options={data:data};}
return fn(context,options);}});};module.exports=exports['default'];}),(function(module,exports,__webpack_require__){'use strict';var _interopRequireDefault=__webpack_require__(1)['default'];exports.__esModule=true;var _utils=__webpack_require__(5);var _exception=__webpack_require__(6);var _exception2=_interopRequireDefault(_exception);exports['default']=function(instance){instance.registerHelper('each',function(context,options){if(!options){throw new _exception2['default']('Must pass iterator to #each');}
var fn=options.fn,inverse=options.inverse,i=0,ret='',data=undefined,contextPath=undefined;if(options.data&&options.ids){contextPath=_utils.appendContextPath(options.data.contextPath,options.ids[0])+'.';}
if(_utils.isFunction(context)){context=context.call(this);}
if(options.data){data=_utils.createFrame(options.data);}
function execIteration(field,index,last){if(data){data.key=field;data.index=index;data.first=index===0;data.last=!!last;if(contextPath){data.contextPath=contextPath+field;}}
ret=ret+fn(context[field],{data:data,blockParams:_utils.blockParams([context[field],field],[contextPath+field,null])});}
if(context&&typeof context==='object'){if(_utils.isArray(context)){for(var j=context.length;i<j;i++){if(i in context){execIteration(i,i,i===context.length-1);}}}else{var priorKey=undefined;for(var key in context){if(context.hasOwnProperty(key)){if(priorKey!==undefined){execIteration(priorKey,i-1);}
priorKey=key;i++;}}
if(priorKey!==undefined){execIteration(priorKey,i-1,true);}}}
if(i===0){ret=inverse(this);}
return ret;});};module.exports=exports['default'];}),(function(module,exports,__webpack_require__){'use strict';var _interopRequireDefault=__webpack_require__(1)['default'];exports.__esModule=true;var _exception=__webpack_require__(6);var _exception2=_interopRequireDefault(_exception);exports['default']=function(instance){instance.registerHelper('helperMissing',function(){if(arguments.length===1){return undefined;}else{throw new _exception2['default']('Missing helper: "'+arguments[arguments.length-1].name+'"');}});};module.exports=exports['default'];}),(function(module,exports,__webpack_require__){'use strict';exports.__esModule=true;var _utils=__webpack_require__(5);exports['default']=function(instance){instance.registerHelper('if',function(conditional,options){if(_utils.isFunction(conditional)){conditional=conditional.call(this);}
if(!options.hash.includeZero&&!conditional||_utils.isEmpty(conditional)){return options.inverse(this);}else{return options.fn(this);}});instance.registerHelper('unless',function(conditional,options){return instance.helpers['if'].call(this,conditional,{fn:options.inverse,inverse:options.fn,hash:options.hash});});};module.exports=exports['default'];}),(function(module,exports){'use strict';exports.__esModule=true;exports['default']=function(instance){instance.registerHelper('log',function(){var args=[undefined],options=arguments[arguments.length-1];for(var i=0;i<arguments.length-1;i++){args.push(arguments[i]);}
var level=1;if(options.hash.level!=null){level=options.hash.level;}else if(options.data&&options.data.level!=null){level=options.data.level;}
args[0]=level;instance.log.apply(instance,args);});};module.exports=exports['default'];}),(function(module,exports){'use strict';exports.__esModule=true;exports['default']=function(instance){instance.registerHelper('lookup',function(obj,field){return obj&&obj[field];});};module.exports=exports['default'];}),(function(module,exports,__webpack_require__){'use strict';exports.__esModule=true;var _utils=__webpack_require__(5);exports['default']=function(instance){instance.registerHelper('with',function(context,options){if(_utils.isFunction(context)){context=context.call(this);}
var fn=options.fn;if(!_utils.isEmpty(context)){var data=options.data;if(options.data&&options.ids){data=_utils.createFrame(options.data);data.contextPath=_utils.appendContextPath(options.data.contextPath,options.ids[0]);}
return fn(context,{data:data,blockParams:_utils.blockParams([context],[data&&data.contextPath])});}else{return options.inverse(this);}});};module.exports=exports['default'];}),(function(module,exports,__webpack_require__){'use strict';var _interopRequireDefault=__webpack_require__(1)['default'];exports.__esModule=true;exports.registerDefaultDecorators=registerDefaultDecorators;var _decoratorsInline=__webpack_require__(19);var _decoratorsInline2=_interopRequireDefault(_decoratorsInline);function registerDefaultDecorators(instance){_decoratorsInline2['default'](instance);}}),(function(module,exports,__webpack_require__){'use strict';exports.__esModule=true;var _utils=__webpack_require__(5);exports['default']=function(instance){instance.registerDecorator('inline',function(fn,props,container,options){var ret=fn;if(!props.partials){props.partials={};ret=function(context,options){var original=container.partials;container.partials=_utils.extend({},original,props.partials);var ret=fn(context,options);container.partials=original;return ret;};}
props.partials[options.args[0]]=options.fn;return ret;});};module.exports=exports['default'];}),(function(module,exports,__webpack_require__){'use strict';exports.__esModule=true;var _utils=__webpack_require__(5);var logger={methodMap:['debug','info','warn','error'],level:'info',lookupLevel:function lookupLevel(level){if(typeof level==='string'){var levelMap=_utils.indexOf(logger.methodMap,level.toLowerCase());if(levelMap>=0){level=levelMap;}else{level=parseInt(level,10);}}
return level;},log:function log(level){level=logger.lookupLevel(level);if(typeof console!=='undefined'&&logger.lookupLevel(logger.level)<=level){var method=logger.methodMap[level];if(!console[method]){method='log';}
for(var _len=arguments.length,message=Array(_len>1?_len-1:0),_key=1;_key<_len;_key++){message[_key-1]=arguments[_key];}
console[method].apply(console,message);}}};exports['default']=logger;module.exports=exports['default'];}),(function(module,exports){'use strict';exports.__esModule=true;function SafeString(string){this.string=string;}
SafeString.prototype.toString=SafeString.prototype.toHTML=function(){return ''+this.string;};exports['default']=SafeString;module.exports=exports['default'];}),(function(module,exports,__webpack_require__){'use strict';var _Object$seal=__webpack_require__(23)['default'];var _interopRequireWildcard=__webpack_require__(3)['default'];var _interopRequireDefault=__webpack_require__(1)['default'];exports.__esModule=true;exports.checkRevision=checkRevision;exports.template=template;exports.wrapProgram=wrapProgram;exports.resolvePartial=resolvePartial;exports.invokePartial=invokePartial;exports.noop=noop;var _utils=__webpack_require__(5);var Utils=_interopRequireWildcard(_utils);var _exception=__webpack_require__(6);var _exception2=_interopRequireDefault(_exception);var _base=__webpack_require__(4);function checkRevision(compilerInfo){var compilerRevision=compilerInfo&&compilerInfo[0]||1,currentRevision=_base.COMPILER_REVISION;if(compilerRevision!==currentRevision){if(compilerRevision<currentRevision){var runtimeVersions=_base.REVISION_CHANGES[currentRevision],compilerVersions=_base.REVISION_CHANGES[compilerRevision];throw new _exception2['default']('Template was precompiled with an older version of Handlebars than the current runtime. '+'Please update your precompiler to a newer version ('+runtimeVersions+') or downgrade your runtime to an older version ('+compilerVersions+').');}else{throw new _exception2['default']('Template was precompiled with a newer version of Handlebars than the current runtime. '+'Please update your runtime to a newer version ('+compilerInfo[1]+').');}}}
function template(templateSpec,env){if(!env){throw new _exception2['default']('No environment passed to template');}
if(!templateSpec||!templateSpec.main){throw new _exception2['default']('Unknown template object: '+typeof templateSpec);}
templateSpec.main.decorator=templateSpec.main_d;env.VM.checkRevision(templateSpec.compiler);function invokePartialWrapper(partial,context,options){if(options.hash){context=Utils.extend({},context,options.hash);if(options.ids){options.ids[0]=true;}}
partial=env.VM.resolvePartial.call(this,partial,context,options);var result=env.VM.invokePartial.call(this,partial,context,options);if(result==null&&env.compile){options.partials[options.name]=env.compile(partial,templateSpec.compilerOptions,env);result=options.partials[options.name](context,options);}
if(result!=null){if(options.indent){var lines=result.split('\n');for(var i=0,l=lines.length;i<l;i++){if(!lines[i]&&i+1===l){break;}
lines[i]=options.indent+lines[i];}
result=lines.join('\n');}
return result;}else{throw new _exception2['default']('The partial '+options.name+' could not be compiled when running in runtime-only mode');}}
var container={strict:function strict(obj,name){if(!(name in obj)){throw new _exception2['default']('"'+name+'" not defined in '+obj);}
return obj[name];},lookup:function lookup(depths,name){var len=depths.length;for(var i=0;i<len;i++){if(depths[i]&&depths[i][name]!=null){return depths[i][name];}}},lambda:function lambda(current,context){return typeof current==='function'?current.call(context):current;},escapeExpression:Utils.escapeExpression,invokePartial:invokePartialWrapper,fn:function fn(i){var ret=templateSpec[i];ret.decorator=templateSpec[i+'_d'];return ret;},programs:[],program:function program(i,data,declaredBlockParams,blockParams,depths){var programWrapper=this.programs[i],fn=this.fn(i);if(data||depths||blockParams||declaredBlockParams){programWrapper=wrapProgram(this,i,fn,data,declaredBlockParams,blockParams,depths);}else if(!programWrapper){programWrapper=this.programs[i]=wrapProgram(this,i,fn);}
return programWrapper;},data:function data(value,depth){while(value&&depth--){value=value._parent;}
return value;},merge:function merge(param,common){var obj=param||common;if(param&&common&&param!==common){obj=Utils.extend({},common,param);}
return obj;},nullContext:_Object$seal({}),noop:env.VM.noop,compilerInfo:templateSpec.compiler};function ret(context){var options=arguments.length<=1||arguments[1]===undefined?{}:arguments[1];var data=options.data;ret._setup(options);if(!options.partial&&templateSpec.useData){data=initData(context,data);}
var depths=undefined,blockParams=templateSpec.useBlockParams?[]:undefined;if(templateSpec.useDepths){if(options.depths){depths=context!=options.depths[0]?[context].concat(options.depths):options.depths;}else{depths=[context];}}
function main(context){return ''+templateSpec.main(container,context,container.helpers,container.partials,data,blockParams,depths);}
main=executeDecorators(templateSpec.main,main,container,options.depths||[],data,blockParams);return main(context,options);}
ret.isTop=true;ret._setup=function(options){if(!options.partial){container.helpers=container.merge(options.helpers,env.helpers);if(templateSpec.usePartial){container.partials=container.merge(options.partials,env.partials);}
if(templateSpec.usePartial||templateSpec.useDecorators){container.decorators=container.merge(options.decorators,env.decorators);}}else{container.helpers=options.helpers;container.partials=options.partials;container.decorators=options.decorators;}};ret._child=function(i,data,blockParams,depths){if(templateSpec.useBlockParams&&!blockParams){throw new _exception2['default']('must pass block params');}
if(templateSpec.useDepths&&!depths){throw new _exception2['default']('must pass parent depths');}
return wrapProgram(container,i,templateSpec[i],data,0,blockParams,depths);};return ret;}
function wrapProgram(container,i,fn,data,declaredBlockParams,blockParams,depths){function prog(context){var options=arguments.length<=1||arguments[1]===undefined?{}:arguments[1];var currentDepths=depths;if(depths&&context!=depths[0]&&!(context===container.nullContext&&depths[0]===null)){currentDepths=[context].concat(depths);}
return fn(container,context,container.helpers,container.partials,options.data||data,blockParams&&[options.blockParams].concat(blockParams),currentDepths);}
prog=executeDecorators(fn,prog,container,depths,data,blockParams);prog.program=i;prog.depth=depths?depths.length:0;prog.blockParams=declaredBlockParams||0;return prog;}
function resolvePartial(partial,context,options){if(!partial){if(options.name==='@partial-block'){partial=options.data['partial-block'];}else{partial=options.partials[options.name];}}else if(!partial.call&&!options.name){options.name=partial;partial=options.partials[partial];}
return partial;}
function invokePartial(partial,context,options){var currentPartialBlock=options.data&&options.data['partial-block'];options.partial=true;if(options.ids){options.data.contextPath=options.ids[0]||options.data.contextPath;}
var partialBlock=undefined;if(options.fn&&options.fn!==noop){(function(){options.data=_base.createFrame(options.data);var fn=options.fn;partialBlock=options.data['partial-block']=function partialBlockWrapper(context){var options=arguments.length<=1||arguments[1]===undefined?{}:arguments[1];options.data=_base.createFrame(options.data);options.data['partial-block']=currentPartialBlock;return fn(context,options);};if(fn.partials){options.partials=Utils.extend({},options.partials,fn.partials);}})();}
if(partial===undefined&&partialBlock){partial=partialBlock;}
if(partial===undefined){throw new _exception2['default']('The partial '+options.name+' could not be found');}else if(partial instanceof Function){return partial(context,options);}}
function noop(){return '';}
function initData(context,data){if(!data||!('root'in data)){data=data?_base.createFrame(data):{};data.root=context;}
return data;}
function executeDecorators(fn,prog,container,depths,data,blockParams){if(fn.decorator){var props={};prog=fn.decorator(prog,props,container,depths&&depths[0],data,blockParams,depths);Utils.extend(prog,props);}
return prog;}}),(function(module,exports,__webpack_require__){module.exports={"default":__webpack_require__(24),__esModule:true};}),(function(module,exports,__webpack_require__){__webpack_require__(25);module.exports=__webpack_require__(30).Object.seal;}),(function(module,exports,__webpack_require__){var isObject=__webpack_require__(26);__webpack_require__(27)('seal',function($seal){return function seal(it){return $seal&&isObject(it)?$seal(it):it;};});}),(function(module,exports){module.exports=function(it){return typeof it==='object'?it!==null:typeof it==='function';};}),(function(module,exports,__webpack_require__){var $export=__webpack_require__(28),core=__webpack_require__(30),fails=__webpack_require__(33);module.exports=function(KEY,exec){var fn=(core.Object||{})[KEY]||Object[KEY],exp={};exp[KEY]=exec(fn);$export($export.S+$export.F*fails(function(){fn(1);}),'Object',exp);};}),(function(module,exports,__webpack_require__){var global=__webpack_require__(29),core=__webpack_require__(30),ctx=__webpack_require__(31),PROTOTYPE='prototype';var $export=function(type,name,source){var IS_FORCED=type&$export.F,IS_GLOBAL=type&$export.G,IS_STATIC=type&$export.S,IS_PROTO=type&$export.P,IS_BIND=type&$export.B,IS_WRAP=type&$export.W,exports=IS_GLOBAL?core:core[name]||(core[name]={}),target=IS_GLOBAL?global:IS_STATIC?global[name]:(global[name]||{})[PROTOTYPE],key,own,out;if(IS_GLOBAL)source=name;for(key in source){own=!IS_FORCED&&target&&key in target;if(own&&key in exports)continue;out=own?target[key]:source[key];exports[key]=IS_GLOBAL&&typeof target[key]!='function'?source[key]:IS_BIND&&own?ctx(out,global):IS_WRAP&&target[key]==out?(function(C){var F=function(param){return this instanceof C?new C(param):C(param);};F[PROTOTYPE]=C[PROTOTYPE];return F;})(out):IS_PROTO&&typeof out=='function'?ctx(Function.call,out):out;if(IS_PROTO)(exports[PROTOTYPE]||(exports[PROTOTYPE]={}))[key]=out;}};$export.F=1;$export.G=2;$export.S=4;$export.P=8;$export.B=16;$export.W=32;module.exports=$export;}),(function(module,exports){var global=module.exports=typeof window!='undefined'&&window.Math==Math?window:typeof self!='undefined'&&self.Math==Math?self:Function('return this')();if(typeof __g=='number')__g=global;}),(function(module,exports){var core=module.exports={version:'1.2.6'};if(typeof __e=='number')__e=core;}),(function(module,exports,__webpack_require__){var aFunction=__webpack_require__(32);module.exports=function(fn,that,length){aFunction(fn);if(that===undefined)return fn;switch(length){case 1:return function(a){return fn.call(that,a);};case 2:return function(a,b){return fn.call(that,a,b);};case 3:return function(a,b,c){return fn.call(that,a,b,c);};}
return function(){return fn.apply(that,arguments);};};}),(function(module,exports){module.exports=function(it){if(typeof it!='function')throw TypeError(it+' is not a function!');return it;};}),(function(module,exports){module.exports=function(exec){try{return!!exec();}catch(e){return true;}};}),(function(module,exports){(function(global){'use strict';exports.__esModule=true;exports['default']=function(Handlebars){var root=typeof global!=='undefined'?global:window,$Handlebars=root.Handlebars;Handlebars.noConflict=function(){if(root.Handlebars===Handlebars){root.Handlebars=$Handlebars;}
return Handlebars;};};module.exports=exports['default'];}.call(exports,(function(){return this;}())))}),(function(module,exports){'use strict';exports.__esModule=true;var AST={helpers:{helperExpression:function helperExpression(node){return node.type==='SubExpression'||(node.type==='MustacheStatement'||node.type==='BlockStatement')&&!!(node.params&&node.params.length||node.hash);},scopedId:function scopedId(path){return(/^\.|this\b/.test(path.original));},simpleId:function simpleId(path){return path.parts.length===1&&!AST.helpers.scopedId(path)&&!path.depth;}}};exports['default']=AST;module.exports=exports['default'];}),(function(module,exports,__webpack_require__){'use strict';var _interopRequireDefault=__webpack_require__(1)['default'];var _interopRequireWildcard=__webpack_require__(3)['default'];exports.__esModule=true;exports.parse=parse;var _parser=__webpack_require__(37);var _parser2=_interopRequireDefault(_parser);var _whitespaceControl=__webpack_require__(38);var _whitespaceControl2=_interopRequireDefault(_whitespaceControl);var _helpers=__webpack_require__(40);var Helpers=_interopRequireWildcard(_helpers);var _utils=__webpack_require__(5);exports.parser=_parser2['default'];var yy={};_utils.extend(yy,Helpers);function parse(input,options){if(input.type==='Program'){return input;}
_parser2['default'].yy=yy;yy.locInfo=function(locInfo){return new yy.SourceLocation(options&&options.srcName,locInfo);};var strip=new _whitespaceControl2['default'](options);return strip.accept(_parser2['default'].parse(input));}}),(function(module,exports){"use strict";exports.__esModule=true;var handlebars=(function(){var parser={trace:function trace(){},yy:{},symbols_:{"error":2,"root":3,"program":4,"EOF":5,"program_repetition0":6,"statement":7,"mustache":8,"block":9,"rawBlock":10,"partial":11,"partialBlock":12,"content":13,"COMMENT":14,"CONTENT":15,"openRawBlock":16,"rawBlock_repetition_plus0":17,"END_RAW_BLOCK":18,"OPEN_RAW_BLOCK":19,"helperName":20,"openRawBlock_repetition0":21,"openRawBlock_option0":22,"CLOSE_RAW_BLOCK":23,"openBlock":24,"block_option0":25,"closeBlock":26,"openInverse":27,"block_option1":28,"OPEN_BLOCK":29,"openBlock_repetition0":30,"openBlock_option0":31,"openBlock_option1":32,"CLOSE":33,"OPEN_INVERSE":34,"openInverse_repetition0":35,"openInverse_option0":36,"openInverse_option1":37,"openInverseChain":38,"OPEN_INVERSE_CHAIN":39,"openInverseChain_repetition0":40,"openInverseChain_option0":41,"openInverseChain_option1":42,"inverseAndProgram":43,"INVERSE":44,"inverseChain":45,"inverseChain_option0":46,"OPEN_ENDBLOCK":47,"OPEN":48,"mustache_repetition0":49,"mustache_option0":50,"OPEN_UNESCAPED":51,"mustache_repetition1":52,"mustache_option1":53,"CLOSE_UNESCAPED":54,"OPEN_PARTIAL":55,"partialName":56,"partial_repetition0":57,"partial_option0":58,"openPartialBlock":59,"OPEN_PARTIAL_BLOCK":60,"openPartialBlock_repetition0":61,"openPartialBlock_option0":62,"param":63,"sexpr":64,"OPEN_SEXPR":65,"sexpr_repetition0":66,"sexpr_option0":67,"CLOSE_SEXPR":68,"hash":69,"hash_repetition_plus0":70,"hashSegment":71,"ID":72,"EQUALS":73,"blockParams":74,"OPEN_BLOCK_PARAMS":75,"blockParams_repetition_plus0":76,"CLOSE_BLOCK_PARAMS":77,"path":78,"dataName":79,"STRING":80,"NUMBER":81,"BOOLEAN":82,"UNDEFINED":83,"NULL":84,"DATA":85,"pathSegments":86,"SEP":87,"$accept":0,"$end":1},terminals_:{2:"error",5:"EOF",14:"COMMENT",15:"CONTENT",18:"END_RAW_BLOCK",19:"OPEN_RAW_BLOCK",23:"CLOSE_RAW_BLOCK",29:"OPEN_BLOCK",33:"CLOSE",34:"OPEN_INVERSE",39:"OPEN_INVERSE_CHAIN",44:"INVERSE",47:"OPEN_ENDBLOCK",48:"OPEN",51:"OPEN_UNESCAPED",54:"CLOSE_UNESCAPED",55:"OPEN_PARTIAL",60:"OPEN_PARTIAL_BLOCK",65:"OPEN_SEXPR",68:"CLOSE_SEXPR",72:"ID",73:"EQUALS",75:"OPEN_BLOCK_PARAMS",77:"CLOSE_BLOCK_PARAMS",80:"STRING",81:"NUMBER",82:"BOOLEAN",83:"UNDEFINED",84:"NULL",85:"DATA",87:"SEP"},productions_:[0,[3,2],[4,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[7,1],[13,1],[10,3],[16,5],[9,4],[9,4],[24,6],[27,6],[38,6],[43,2],[45,3],[45,1],[26,3],[8,5],[8,5],[11,5],[12,3],[59,5],[63,1],[63,1],[64,5],[69,1],[71,3],[74,3],[20,1],[20,1],[20,1],[20,1],[20,1],[20,1],[20,1],[56,1],[56,1],[79,2],[78,1],[86,3],[86,1],[6,0],[6,2],[17,1],[17,2],[21,0],[21,2],[22,0],[22,1],[25,0],[25,1],[28,0],[28,1],[30,0],[30,2],[31,0],[31,1],[32,0],[32,1],[35,0],[35,2],[36,0],[36,1],[37,0],[37,1],[40,0],[40,2],[41,0],[41,1],[42,0],[42,1],[46,0],[46,1],[49,0],[49,2],[50,0],[50,1],[52,0],[52,2],[53,0],[53,1],[57,0],[57,2],[58,0],[58,1],[61,0],[61,2],[62,0],[62,1],[66,0],[66,2],[67,0],[67,1],[70,1],[70,2],[76,1],[76,2]],performAction:function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$){var $0=$$.length-1;switch(yystate){case 1:return $$[$0-1];break;case 2:this.$=yy.prepareProgram($$[$0]);break;case 3:this.$=$$[$0];break;case 4:this.$=$$[$0];break;case 5:this.$=$$[$0];break;case 6:this.$=$$[$0];break;case 7:this.$=$$[$0];break;case 8:this.$=$$[$0];break;case 9:this.$={type:'CommentStatement',value:yy.stripComment($$[$0]),strip:yy.stripFlags($$[$0],$$[$0]),loc:yy.locInfo(this._$)};break;case 10:this.$={type:'ContentStatement',original:$$[$0],value:$$[$0],loc:yy.locInfo(this._$)};break;case 11:this.$=yy.prepareRawBlock($$[$0-2],$$[$0-1],$$[$0],this._$);break;case 12:this.$={path:$$[$0-3],params:$$[$0-2],hash:$$[$0-1]};break;case 13:this.$=yy.prepareBlock($$[$0-3],$$[$0-2],$$[$0-1],$$[$0],false,this._$);break;case 14:this.$=yy.prepareBlock($$[$0-3],$$[$0-2],$$[$0-1],$$[$0],true,this._$);break;case 15:this.$={open:$$[$0-5],path:$$[$0-4],params:$$[$0-3],hash:$$[$0-2],blockParams:$$[$0-1],strip:yy.stripFlags($$[$0-5],$$[$0])};break;case 16:this.$={path:$$[$0-4],params:$$[$0-3],hash:$$[$0-2],blockParams:$$[$0-1],strip:yy.stripFlags($$[$0-5],$$[$0])};break;case 17:this.$={path:$$[$0-4],params:$$[$0-3],hash:$$[$0-2],blockParams:$$[$0-1],strip:yy.stripFlags($$[$0-5],$$[$0])};break;case 18:this.$={strip:yy.stripFlags($$[$0-1],$$[$0-1]),program:$$[$0]};break;case 19:var inverse=yy.prepareBlock($$[$0-2],$$[$0-1],$$[$0],$$[$0],false,this._$),program=yy.prepareProgram([inverse],$$[$0-1].loc);program.chained=true;this.$={strip:$$[$0-2].strip,program:program,chain:true};break;case 20:this.$=$$[$0];break;case 21:this.$={path:$$[$0-1],strip:yy.stripFlags($$[$0-2],$$[$0])};break;case 22:this.$=yy.prepareMustache($$[$0-3],$$[$0-2],$$[$0-1],$$[$0-4],yy.stripFlags($$[$0-4],$$[$0]),this._$);break;case 23:this.$=yy.prepareMustache($$[$0-3],$$[$0-2],$$[$0-1],$$[$0-4],yy.stripFlags($$[$0-4],$$[$0]),this._$);break;case 24:this.$={type:'PartialStatement',name:$$[$0-3],params:$$[$0-2],hash:$$[$0-1],indent:'',strip:yy.stripFlags($$[$0-4],$$[$0]),loc:yy.locInfo(this._$)};break;case 25:this.$=yy.preparePartialBlock($$[$0-2],$$[$0-1],$$[$0],this._$);break;case 26:this.$={path:$$[$0-3],params:$$[$0-2],hash:$$[$0-1],strip:yy.stripFlags($$[$0-4],$$[$0])};break;case 27:this.$=$$[$0];break;case 28:this.$=$$[$0];break;case 29:this.$={type:'SubExpression',path:$$[$0-3],params:$$[$0-2],hash:$$[$0-1],loc:yy.locInfo(this._$)};break;case 30:this.$={type:'Hash',pairs:$$[$0],loc:yy.locInfo(this._$)};break;case 31:this.$={type:'HashPair',key:yy.id($$[$0-2]),value:$$[$0],loc:yy.locInfo(this._$)};break;case 32:this.$=yy.id($$[$0-1]);break;case 33:this.$=$$[$0];break;case 34:this.$=$$[$0];break;case 35:this.$={type:'StringLiteral',value:$$[$0],original:$$[$0],loc:yy.locInfo(this._$)};break;case 36:this.$={type:'NumberLiteral',value:Number($$[$0]),original:Number($$[$0]),loc:yy.locInfo(this._$)};break;case 37:this.$={type:'BooleanLiteral',value:$$[$0]==='true',original:$$[$0]==='true',loc:yy.locInfo(this._$)};break;case 38:this.$={type:'UndefinedLiteral',original:undefined,value:undefined,loc:yy.locInfo(this._$)};break;case 39:this.$={type:'NullLiteral',original:null,value:null,loc:yy.locInfo(this._$)};break;case 40:this.$=$$[$0];break;case 41:this.$=$$[$0];break;case 42:this.$=yy.preparePath(true,$$[$0],this._$);break;case 43:this.$=yy.preparePath(false,$$[$0],this._$);break;case 44:$$[$0-2].push({part:yy.id($$[$0]),original:$$[$0],separator:$$[$0-1]});this.$=$$[$0-2];break;case 45:this.$=[{part:yy.id($$[$0]),original:$$[$0]}];break;case 46:this.$=[];break;case 47:$$[$0-1].push($$[$0]);break;case 48:this.$=[$$[$0]];break;case 49:$$[$0-1].push($$[$0]);break;case 50:this.$=[];break;case 51:$$[$0-1].push($$[$0]);break;case 58:this.$=[];break;case 59:$$[$0-1].push($$[$0]);break;case 64:this.$=[];break;case 65:$$[$0-1].push($$[$0]);break;case 70:this.$=[];break;case 71:$$[$0-1].push($$[$0]);break;case 78:this.$=[];break;case 79:$$[$0-1].push($$[$0]);break;case 82:this.$=[];break;case 83:$$[$0-1].push($$[$0]);break;case 86:this.$=[];break;case 87:$$[$0-1].push($$[$0]);break;case 90:this.$=[];break;case 91:$$[$0-1].push($$[$0]);break;case 94:this.$=[];break;case 95:$$[$0-1].push($$[$0]);break;case 98:this.$=[$$[$0]];break;case 99:$$[$0-1].push($$[$0]);break;case 100:this.$=[$$[$0]];break;case 101:$$[$0-1].push($$[$0]);break;}},table:[{3:1,4:2,5:[2,46],6:3,14:[2,46],15:[2,46],19:[2,46],29:[2,46],34:[2,46],48:[2,46],51:[2,46],55:[2,46],60:[2,46]},{1:[3]},{5:[1,4]},{5:[2,2],7:5,8:6,9:7,10:8,11:9,12:10,13:11,14:[1,12],15:[1,20],16:17,19:[1,23],24:15,27:16,29:[1,21],34:[1,22],39:[2,2],44:[2,2],47:[2,2],48:[1,13],51:[1,14],55:[1,18],59:19,60:[1,24]},{1:[2,1]},{5:[2,47],14:[2,47],15:[2,47],19:[2,47],29:[2,47],34:[2,47],39:[2,47],44:[2,47],47:[2,47],48:[2,47],51:[2,47],55:[2,47],60:[2,47]},{5:[2,3],14:[2,3],15:[2,3],19:[2,3],29:[2,3],34:[2,3],39:[2,3],44:[2,3],47:[2,3],48:[2,3],51:[2,3],55:[2,3],60:[2,3]},{5:[2,4],14:[2,4],15:[2,4],19:[2,4],29:[2,4],34:[2,4],39:[2,4],44:[2,4],47:[2,4],48:[2,4],51:[2,4],55:[2,4],60:[2,4]},{5:[2,5],14:[2,5],15:[2,5],19:[2,5],29:[2,5],34:[2,5],39:[2,5],44:[2,5],47:[2,5],48:[2,5],51:[2,5],55:[2,5],60:[2,5]},{5:[2,6],14:[2,6],15:[2,6],19:[2,6],29:[2,6],34:[2,6],39:[2,6],44:[2,6],47:[2,6],48:[2,6],51:[2,6],55:[2,6],60:[2,6]},{5:[2,7],14:[2,7],15:[2,7],19:[2,7],29:[2,7],34:[2,7],39:[2,7],44:[2,7],47:[2,7],48:[2,7],51:[2,7],55:[2,7],60:[2,7]},{5:[2,8],14:[2,8],15:[2,8],19:[2,8],29:[2,8],34:[2,8],39:[2,8],44:[2,8],47:[2,8],48:[2,8],51:[2,8],55:[2,8],60:[2,8]},{5:[2,9],14:[2,9],15:[2,9],19:[2,9],29:[2,9],34:[2,9],39:[2,9],44:[2,9],47:[2,9],48:[2,9],51:[2,9],55:[2,9],60:[2,9]},{20:25,72:[1,35],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{20:36,72:[1,35],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{4:37,6:3,14:[2,46],15:[2,46],19:[2,46],29:[2,46],34:[2,46],39:[2,46],44:[2,46],47:[2,46],48:[2,46],51:[2,46],55:[2,46],60:[2,46]},{4:38,6:3,14:[2,46],15:[2,46],19:[2,46],29:[2,46],34:[2,46],44:[2,46],47:[2,46],48:[2,46],51:[2,46],55:[2,46],60:[2,46]},{13:40,15:[1,20],17:39},{20:42,56:41,64:43,65:[1,44],72:[1,35],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{4:45,6:3,14:[2,46],15:[2,46],19:[2,46],29:[2,46],34:[2,46],47:[2,46],48:[2,46],51:[2,46],55:[2,46],60:[2,46]},{5:[2,10],14:[2,10],15:[2,10],18:[2,10],19:[2,10],29:[2,10],34:[2,10],39:[2,10],44:[2,10],47:[2,10],48:[2,10],51:[2,10],55:[2,10],60:[2,10]},{20:46,72:[1,35],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{20:47,72:[1,35],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{20:48,72:[1,35],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{20:42,56:49,64:43,65:[1,44],72:[1,35],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{33:[2,78],49:50,65:[2,78],72:[2,78],80:[2,78],81:[2,78],82:[2,78],83:[2,78],84:[2,78],85:[2,78]},{23:[2,33],33:[2,33],54:[2,33],65:[2,33],68:[2,33],72:[2,33],75:[2,33],80:[2,33],81:[2,33],82:[2,33],83:[2,33],84:[2,33],85:[2,33]},{23:[2,34],33:[2,34],54:[2,34],65:[2,34],68:[2,34],72:[2,34],75:[2,34],80:[2,34],81:[2,34],82:[2,34],83:[2,34],84:[2,34],85:[2,34]},{23:[2,35],33:[2,35],54:[2,35],65:[2,35],68:[2,35],72:[2,35],75:[2,35],80:[2,35],81:[2,35],82:[2,35],83:[2,35],84:[2,35],85:[2,35]},{23:[2,36],33:[2,36],54:[2,36],65:[2,36],68:[2,36],72:[2,36],75:[2,36],80:[2,36],81:[2,36],82:[2,36],83:[2,36],84:[2,36],85:[2,36]},{23:[2,37],33:[2,37],54:[2,37],65:[2,37],68:[2,37],72:[2,37],75:[2,37],80:[2,37],81:[2,37],82:[2,37],83:[2,37],84:[2,37],85:[2,37]},{23:[2,38],33:[2,38],54:[2,38],65:[2,38],68:[2,38],72:[2,38],75:[2,38],80:[2,38],81:[2,38],82:[2,38],83:[2,38],84:[2,38],85:[2,38]},{23:[2,39],33:[2,39],54:[2,39],65:[2,39],68:[2,39],72:[2,39],75:[2,39],80:[2,39],81:[2,39],82:[2,39],83:[2,39],84:[2,39],85:[2,39]},{23:[2,43],33:[2,43],54:[2,43],65:[2,43],68:[2,43],72:[2,43],75:[2,43],80:[2,43],81:[2,43],82:[2,43],83:[2,43],84:[2,43],85:[2,43],87:[1,51]},{72:[1,35],86:52},{23:[2,45],33:[2,45],54:[2,45],65:[2,45],68:[2,45],72:[2,45],75:[2,45],80:[2,45],81:[2,45],82:[2,45],83:[2,45],84:[2,45],85:[2,45],87:[2,45]},{52:53,54:[2,82],65:[2,82],72:[2,82],80:[2,82],81:[2,82],82:[2,82],83:[2,82],84:[2,82],85:[2,82]},{25:54,38:56,39:[1,58],43:57,44:[1,59],45:55,47:[2,54]},{28:60,43:61,44:[1,59],47:[2,56]},{13:63,15:[1,20],18:[1,62]},{15:[2,48],18:[2,48]},{33:[2,86],57:64,65:[2,86],72:[2,86],80:[2,86],81:[2,86],82:[2,86],83:[2,86],84:[2,86],85:[2,86]},{33:[2,40],65:[2,40],72:[2,40],80:[2,40],81:[2,40],82:[2,40],83:[2,40],84:[2,40],85:[2,40]},{33:[2,41],65:[2,41],72:[2,41],80:[2,41],81:[2,41],82:[2,41],83:[2,41],84:[2,41],85:[2,41]},{20:65,72:[1,35],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{26:66,47:[1,67]},{30:68,33:[2,58],65:[2,58],72:[2,58],75:[2,58],80:[2,58],81:[2,58],82:[2,58],83:[2,58],84:[2,58],85:[2,58]},{33:[2,64],35:69,65:[2,64],72:[2,64],75:[2,64],80:[2,64],81:[2,64],82:[2,64],83:[2,64],84:[2,64],85:[2,64]},{21:70,23:[2,50],65:[2,50],72:[2,50],80:[2,50],81:[2,50],82:[2,50],83:[2,50],84:[2,50],85:[2,50]},{33:[2,90],61:71,65:[2,90],72:[2,90],80:[2,90],81:[2,90],82:[2,90],83:[2,90],84:[2,90],85:[2,90]},{20:75,33:[2,80],50:72,63:73,64:76,65:[1,44],69:74,70:77,71:78,72:[1,79],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{72:[1,80]},{23:[2,42],33:[2,42],54:[2,42],65:[2,42],68:[2,42],72:[2,42],75:[2,42],80:[2,42],81:[2,42],82:[2,42],83:[2,42],84:[2,42],85:[2,42],87:[1,51]},{20:75,53:81,54:[2,84],63:82,64:76,65:[1,44],69:83,70:77,71:78,72:[1,79],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{26:84,47:[1,67]},{47:[2,55]},{4:85,6:3,14:[2,46],15:[2,46],19:[2,46],29:[2,46],34:[2,46],39:[2,46],44:[2,46],47:[2,46],48:[2,46],51:[2,46],55:[2,46],60:[2,46]},{47:[2,20]},{20:86,72:[1,35],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{4:87,6:3,14:[2,46],15:[2,46],19:[2,46],29:[2,46],34:[2,46],47:[2,46],48:[2,46],51:[2,46],55:[2,46],60:[2,46]},{26:88,47:[1,67]},{47:[2,57]},{5:[2,11],14:[2,11],15:[2,11],19:[2,11],29:[2,11],34:[2,11],39:[2,11],44:[2,11],47:[2,11],48:[2,11],51:[2,11],55:[2,11],60:[2,11]},{15:[2,49],18:[2,49]},{20:75,33:[2,88],58:89,63:90,64:76,65:[1,44],69:91,70:77,71:78,72:[1,79],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{65:[2,94],66:92,68:[2,94],72:[2,94],80:[2,94],81:[2,94],82:[2,94],83:[2,94],84:[2,94],85:[2,94]},{5:[2,25],14:[2,25],15:[2,25],19:[2,25],29:[2,25],34:[2,25],39:[2,25],44:[2,25],47:[2,25],48:[2,25],51:[2,25],55:[2,25],60:[2,25]},{20:93,72:[1,35],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{20:75,31:94,33:[2,60],63:95,64:76,65:[1,44],69:96,70:77,71:78,72:[1,79],75:[2,60],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{20:75,33:[2,66],36:97,63:98,64:76,65:[1,44],69:99,70:77,71:78,72:[1,79],75:[2,66],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{20:75,22:100,23:[2,52],63:101,64:76,65:[1,44],69:102,70:77,71:78,72:[1,79],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{20:75,33:[2,92],62:103,63:104,64:76,65:[1,44],69:105,70:77,71:78,72:[1,79],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{33:[1,106]},{33:[2,79],65:[2,79],72:[2,79],80:[2,79],81:[2,79],82:[2,79],83:[2,79],84:[2,79],85:[2,79]},{33:[2,81]},{23:[2,27],33:[2,27],54:[2,27],65:[2,27],68:[2,27],72:[2,27],75:[2,27],80:[2,27],81:[2,27],82:[2,27],83:[2,27],84:[2,27],85:[2,27]},{23:[2,28],33:[2,28],54:[2,28],65:[2,28],68:[2,28],72:[2,28],75:[2,28],80:[2,28],81:[2,28],82:[2,28],83:[2,28],84:[2,28],85:[2,28]},{23:[2,30],33:[2,30],54:[2,30],68:[2,30],71:107,72:[1,108],75:[2,30]},{23:[2,98],33:[2,98],54:[2,98],68:[2,98],72:[2,98],75:[2,98]},{23:[2,45],33:[2,45],54:[2,45],65:[2,45],68:[2,45],72:[2,45],73:[1,109],75:[2,45],80:[2,45],81:[2,45],82:[2,45],83:[2,45],84:[2,45],85:[2,45],87:[2,45]},{23:[2,44],33:[2,44],54:[2,44],65:[2,44],68:[2,44],72:[2,44],75:[2,44],80:[2,44],81:[2,44],82:[2,44],83:[2,44],84:[2,44],85:[2,44],87:[2,44]},{54:[1,110]},{54:[2,83],65:[2,83],72:[2,83],80:[2,83],81:[2,83],82:[2,83],83:[2,83],84:[2,83],85:[2,83]},{54:[2,85]},{5:[2,13],14:[2,13],15:[2,13],19:[2,13],29:[2,13],34:[2,13],39:[2,13],44:[2,13],47:[2,13],48:[2,13],51:[2,13],55:[2,13],60:[2,13]},{38:56,39:[1,58],43:57,44:[1,59],45:112,46:111,47:[2,76]},{33:[2,70],40:113,65:[2,70],72:[2,70],75:[2,70],80:[2,70],81:[2,70],82:[2,70],83:[2,70],84:[2,70],85:[2,70]},{47:[2,18]},{5:[2,14],14:[2,14],15:[2,14],19:[2,14],29:[2,14],34:[2,14],39:[2,14],44:[2,14],47:[2,14],48:[2,14],51:[2,14],55:[2,14],60:[2,14]},{33:[1,114]},{33:[2,87],65:[2,87],72:[2,87],80:[2,87],81:[2,87],82:[2,87],83:[2,87],84:[2,87],85:[2,87]},{33:[2,89]},{20:75,63:116,64:76,65:[1,44],67:115,68:[2,96],69:117,70:77,71:78,72:[1,79],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{33:[1,118]},{32:119,33:[2,62],74:120,75:[1,121]},{33:[2,59],65:[2,59],72:[2,59],75:[2,59],80:[2,59],81:[2,59],82:[2,59],83:[2,59],84:[2,59],85:[2,59]},{33:[2,61],75:[2,61]},{33:[2,68],37:122,74:123,75:[1,121]},{33:[2,65],65:[2,65],72:[2,65],75:[2,65],80:[2,65],81:[2,65],82:[2,65],83:[2,65],84:[2,65],85:[2,65]},{33:[2,67],75:[2,67]},{23:[1,124]},{23:[2,51],65:[2,51],72:[2,51],80:[2,51],81:[2,51],82:[2,51],83:[2,51],84:[2,51],85:[2,51]},{23:[2,53]},{33:[1,125]},{33:[2,91],65:[2,91],72:[2,91],80:[2,91],81:[2,91],82:[2,91],83:[2,91],84:[2,91],85:[2,91]},{33:[2,93]},{5:[2,22],14:[2,22],15:[2,22],19:[2,22],29:[2,22],34:[2,22],39:[2,22],44:[2,22],47:[2,22],48:[2,22],51:[2,22],55:[2,22],60:[2,22]},{23:[2,99],33:[2,99],54:[2,99],68:[2,99],72:[2,99],75:[2,99]},{73:[1,109]},{20:75,63:126,64:76,65:[1,44],72:[1,35],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{5:[2,23],14:[2,23],15:[2,23],19:[2,23],29:[2,23],34:[2,23],39:[2,23],44:[2,23],47:[2,23],48:[2,23],51:[2,23],55:[2,23],60:[2,23]},{47:[2,19]},{47:[2,77]},{20:75,33:[2,72],41:127,63:128,64:76,65:[1,44],69:129,70:77,71:78,72:[1,79],75:[2,72],78:26,79:27,80:[1,28],81:[1,29],82:[1,30],83:[1,31],84:[1,32],85:[1,34],86:33},{5:[2,24],14:[2,24],15:[2,24],19:[2,24],29:[2,24],34:[2,24],39:[2,24],44:[2,24],47:[2,24],48:[2,24],51:[2,24],55:[2,24],60:[2,24]},{68:[1,130]},{65:[2,95],68:[2,95],72:[2,95],80:[2,95],81:[2,95],82:[2,95],83:[2,95],84:[2,95],85:[2,95]},{68:[2,97]},{5:[2,21],14:[2,21],15:[2,21],19:[2,21],29:[2,21],34:[2,21],39:[2,21],44:[2,21],47:[2,21],48:[2,21],51:[2,21],55:[2,21],60:[2,21]},{33:[1,131]},{33:[2,63]},{72:[1,133],76:132},{33:[1,134]},{33:[2,69]},{15:[2,12]},{14:[2,26],15:[2,26],19:[2,26],29:[2,26],34:[2,26],47:[2,26],48:[2,26],51:[2,26],55:[2,26],60:[2,26]},{23:[2,31],33:[2,31],54:[2,31],68:[2,31],72:[2,31],75:[2,31]},{33:[2,74],42:135,74:136,75:[1,121]},{33:[2,71],65:[2,71],72:[2,71],75:[2,71],80:[2,71],81:[2,71],82:[2,71],83:[2,71],84:[2,71],85:[2,71]},{33:[2,73],75:[2,73]},{23:[2,29],33:[2,29],54:[2,29],65:[2,29],68:[2,29],72:[2,29],75:[2,29],80:[2,29],81:[2,29],82:[2,29],83:[2,29],84:[2,29],85:[2,29]},{14:[2,15],15:[2,15],19:[2,15],29:[2,15],34:[2,15],39:[2,15],44:[2,15],47:[2,15],48:[2,15],51:[2,15],55:[2,15],60:[2,15]},{72:[1,138],77:[1,137]},{72:[2,100],77:[2,100]},{14:[2,16],15:[2,16],19:[2,16],29:[2,16],34:[2,16],44:[2,16],47:[2,16],48:[2,16],51:[2,16],55:[2,16],60:[2,16]},{33:[1,139]},{33:[2,75]},{33:[2,32]},{72:[2,101],77:[2,101]},{14:[2,17],15:[2,17],19:[2,17],29:[2,17],34:[2,17],39:[2,17],44:[2,17],47:[2,17],48:[2,17],51:[2,17],55:[2,17],60:[2,17]}],defaultActions:{4:[2,1],55:[2,55],57:[2,20],61:[2,57],74:[2,81],83:[2,85],87:[2,18],91:[2,89],102:[2,53],105:[2,93],111:[2,19],112:[2,77],117:[2,97],120:[2,63],123:[2,69],124:[2,12],136:[2,75],137:[2,32]},parseError:function parseError(str,hash){throw new Error(str);},parse:function parse(input){var self=this,stack=[0],vstack=[null],lstack=[],table=this.table,yytext="",yylineno=0,yyleng=0,recovering=0,TERROR=2,EOF=1;this.lexer.setInput(input);this.lexer.yy=this.yy;this.yy.lexer=this.lexer;this.yy.parser=this;if(typeof this.lexer.yylloc=="undefined")this.lexer.yylloc={};var yyloc=this.lexer.yylloc;lstack.push(yyloc);var ranges=this.lexer.options&&this.lexer.options.ranges;if(typeof this.yy.parseError==="function")this.parseError=this.yy.parseError;function popStack(n){stack.length=stack.length-2*n;vstack.length=vstack.length-n;lstack.length=lstack.length-n;}
function lex(){var token;token=self.lexer.lex()||1;if(typeof token!=="number"){token=self.symbols_[token]||token;}
return token;}
var symbol,preErrorSymbol,state,action,a,r,yyval={},p,len,newState,expected;while(true){state=stack[stack.length-1];if(this.defaultActions[state]){action=this.defaultActions[state];}else{if(symbol===null||typeof symbol=="undefined"){symbol=lex();}
action=table[state]&&table[state][symbol];}
if(typeof action==="undefined"||!action.length||!action[0]){var errStr="";if(!recovering){expected=[];for(p in table[state])if(this.terminals_[p]&&p>2){expected.push("'"+this.terminals_[p]+"'");}
if(this.lexer.showPosition){errStr="Parse error on line "+(yylineno+1)+":\n"+this.lexer.showPosition()+"\nExpecting "+expected.join(", ")+", got '"+(this.terminals_[symbol]||symbol)+"'";}else{errStr="Parse error on line "+(yylineno+1)+": Unexpected "+(symbol==1?"end of input":"'"+(this.terminals_[symbol]||symbol)+"'");}
this.parseError(errStr,{text:this.lexer.match,token:this.terminals_[symbol]||symbol,line:this.lexer.yylineno,loc:yyloc,expected:expected});}}
if(action[0]instanceof Array&&action.length>1){throw new Error("Parse Error: multiple actions possible at state: "+state+", token: "+symbol);}
switch(action[0]){case 1:stack.push(symbol);vstack.push(this.lexer.yytext);lstack.push(this.lexer.yylloc);stack.push(action[1]);symbol=null;if(!preErrorSymbol){yyleng=this.lexer.yyleng;yytext=this.lexer.yytext;yylineno=this.lexer.yylineno;yyloc=this.lexer.yylloc;if(recovering>0)recovering--;}else{symbol=preErrorSymbol;preErrorSymbol=null;}
break;case 2:len=this.productions_[action[1]][1];yyval.$=vstack[vstack.length-len];yyval._$={first_line:lstack[lstack.length-(len||1)].first_line,last_line:lstack[lstack.length-1].last_line,first_column:lstack[lstack.length-(len||1)].first_column,last_column:lstack[lstack.length-1].last_column};if(ranges){yyval._$.range=[lstack[lstack.length-(len||1)].range[0],lstack[lstack.length-1].range[1]];}
r=this.performAction.call(yyval,yytext,yyleng,yylineno,this.yy,action[1],vstack,lstack);if(typeof r!=="undefined"){return r;}
if(len){stack=stack.slice(0,-1*len*2);vstack=vstack.slice(0,-1*len);lstack=lstack.slice(0,-1*len);}
stack.push(this.productions_[action[1]][0]);vstack.push(yyval.$);lstack.push(yyval._$);newState=table[stack[stack.length-2]][stack[stack.length-1]];stack.push(newState);break;case 3:return true;}}
return true;}};var lexer=(function(){var lexer={EOF:1,parseError:function parseError(str,hash){if(this.yy.parser){this.yy.parser.parseError(str,hash);}else{throw new Error(str);}},setInput:function setInput(input){this._input=input;this._more=this._less=this.done=false;this.yylineno=this.yyleng=0;this.yytext=this.matched=this.match='';this.conditionStack=['INITIAL'];this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0};if(this.options.ranges)this.yylloc.range=[0,0];this.offset=0;return this;},input:function input(){var ch=this._input[0];this.yytext+=ch;this.yyleng++;this.offset++;this.match+=ch;this.matched+=ch;var lines=ch.match(/(?:\r\n?|\n).*/g);if(lines){this.yylineno++;this.yylloc.last_line++;}else{this.yylloc.last_column++;}
if(this.options.ranges)this.yylloc.range[1]++;this._input=this._input.slice(1);return ch;},unput:function unput(ch){var len=ch.length;var lines=ch.split(/(?:\r\n?|\n)/g);this._input=ch+this._input;this.yytext=this.yytext.substr(0,this.yytext.length-len-1);this.offset-=len;var oldLines=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1);this.matched=this.matched.substr(0,this.matched.length-1);if(lines.length-1)this.yylineno-=lines.length-1;var r=this.yylloc.range;this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:lines?(lines.length===oldLines.length?this.yylloc.first_column:0)+oldLines[oldLines.length-lines.length].length-lines[0].length:this.yylloc.first_column-len};if(this.options.ranges){this.yylloc.range=[r[0],r[0]+this.yyleng-len];}
return this;},more:function more(){this._more=true;return this;},less:function less(n){this.unput(this.match.slice(n));},pastInput:function pastInput(){var past=this.matched.substr(0,this.matched.length-this.match.length);return(past.length>20?'...':'')+past.substr(-20).replace(/\n/g,"");},upcomingInput:function upcomingInput(){var next=this.match;if(next.length<20){next+=this._input.substr(0,20-next.length);}
return(next.substr(0,20)+(next.length>20?'...':'')).replace(/\n/g,"");},showPosition:function showPosition(){var pre=this.pastInput();var c=new Array(pre.length+1).join("-");return pre+this.upcomingInput()+"\n"+c+"^";},next:function next(){if(this.done){return this.EOF;}
if(!this._input)this.done=true;var token,match,tempMatch,index,col,lines;if(!this._more){this.yytext='';this.match='';}
var rules=this._currentRules();for(var i=0;i<rules.length;i++){tempMatch=this._input.match(this.rules[rules[i]]);if(tempMatch&&(!match||tempMatch[0].length>match[0].length)){match=tempMatch;index=i;if(!this.options.flex)break;}}
if(match){lines=match[0].match(/(?:\r\n?|\n).*/g);if(lines)this.yylineno+=lines.length;this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:lines?lines[lines.length-1].length-lines[lines.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+match[0].length};this.yytext+=match[0];this.match+=match[0];this.matches=match;this.yyleng=this.yytext.length;if(this.options.ranges){this.yylloc.range=[this.offset,this.offset+=this.yyleng];}
this._more=false;this._input=this._input.slice(match[0].length);this.matched+=match[0];token=this.performAction.call(this,this.yy,this,rules[index],this.conditionStack[this.conditionStack.length-1]);if(this.done&&this._input)this.done=false;if(token)return token;else return;}
if(this._input===""){return this.EOF;}else{return this.parseError('Lexical error on line '+(this.yylineno+1)+'. Unrecognized text.\n'+this.showPosition(),{text:"",token:null,line:this.yylineno});}},lex:function lex(){var r=this.next();if(typeof r!=='undefined'){return r;}else{return this.lex();}},begin:function begin(condition){this.conditionStack.push(condition);},popState:function popState(){return this.conditionStack.pop();},_currentRules:function _currentRules(){return this.conditions[this.conditionStack[this.conditionStack.length-1]].rules;},topState:function topState(){return this.conditionStack[this.conditionStack.length-2];},pushState:function begin(condition){this.begin(condition);}};lexer.options={};lexer.performAction=function anonymous(yy,yy_,$avoiding_name_collisions,YY_START){function strip(start,end){return yy_.yytext=yy_.yytext.substr(start,yy_.yyleng-end);}
var YYSTATE=YY_START;switch($avoiding_name_collisions){case 0:if(yy_.yytext.slice(-2)==="\\\\"){strip(0,1);this.begin("mu");}else if(yy_.yytext.slice(-1)==="\\"){strip(0,1);this.begin("emu");}else{this.begin("mu");}
if(yy_.yytext)return 15;break;case 1:return 15;break;case 2:this.popState();return 15;break;case 3:this.begin('raw');return 15;break;case 4:this.popState();if(this.conditionStack[this.conditionStack.length-1]==='raw'){return 15;}else{yy_.yytext=yy_.yytext.substr(5,yy_.yyleng-9);return 'END_RAW_BLOCK';}
break;case 5:return 15;break;case 6:this.popState();return 14;break;case 7:return 65;break;case 8:return 68;break;case 9:return 19;break;case 10:this.popState();this.begin('raw');return 23;break;case 11:return 55;break;case 12:return 60;break;case 13:return 29;break;case 14:return 47;break;case 15:this.popState();return 44;break;case 16:this.popState();return 44;break;case 17:return 34;break;case 18:return 39;break;case 19:return 51;break;case 20:return 48;break;case 21:this.unput(yy_.yytext);this.popState();this.begin('com');break;case 22:this.popState();return 14;break;case 23:return 48;break;case 24:return 73;break;case 25:return 72;break;case 26:return 72;break;case 27:return 87;break;case 28:break;case 29:this.popState();return 54;break;case 30:this.popState();return 33;break;case 31:yy_.yytext=strip(1,2).replace(/\\"/g,'"');return 80;break;case 32:yy_.yytext=strip(1,2).replace(/\\'/g,"'");return 80;break;case 33:return 85;break;case 34:return 82;break;case 35:return 82;break;case 36:return 83;break;case 37:return 84;break;case 38:return 81;break;case 39:return 75;break;case 40:return 77;break;case 41:return 72;break;case 42:yy_.yytext=yy_.yytext.replace(/\\([\\\]])/g,'$1');return 72;break;case 43:return 'INVALID';break;case 44:return 5;break;}};lexer.rules=[/^(?:[^\x00]*?(?=(\{\{)))/,/^(?:[^\x00]+)/,/^(?:[^\x00]{2,}?(?=(\{\{|\\\{\{|\\\\\{\{|$)))/,/^(?:\{\{\{\{(?=[^\/]))/,/^(?:\{\{\{\{\/[^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=[=}\s\/.])\}\}\}\})/,/^(?:[^\x00]*?(?=(\{\{\{\{)))/,/^(?:[\s\S]*?--(~)?\}\})/,/^(?:\()/,/^(?:\))/,/^(?:\{\{\{\{)/,/^(?:\}\}\}\})/,/^(?:\{\{(~)?>)/,/^(?:\{\{(~)?#>)/,/^(?:\{\{(~)?#\*?)/,/^(?:\{\{(~)?\/)/,/^(?:\{\{(~)?\^\s*(~)?\}\})/,/^(?:\{\{(~)?\s*else\s*(~)?\}\})/,/^(?:\{\{(~)?\^)/,/^(?:\{\{(~)?\s*else\b)/,/^(?:\{\{(~)?\{)/,/^(?:\{\{(~)?&)/,/^(?:\{\{(~)?!--)/,/^(?:\{\{(~)?![\s\S]*?\}\})/,/^(?:\{\{(~)?\*?)/,/^(?:=)/,/^(?:\.\.)/,/^(?:\.(?=([=~}\s\/.)|])))/,/^(?:[\/.])/,/^(?:\s+)/,/^(?:\}(~)?\}\})/,/^(?:(~)?\}\})/,/^(?:"(\\["]|[^"])*")/,/^(?:'(\\[']|[^'])*')/,/^(?:@)/,/^(?:true(?=([~}\s)])))/,/^(?:false(?=([~}\s)])))/,/^(?:undefined(?=([~}\s)])))/,/^(?:null(?=([~}\s)])))/,/^(?:-?[0-9]+(?:\.[0-9]+)?(?=([~}\s)])))/,/^(?:as\s+\|)/,/^(?:\|)/,/^(?:([^\s!"#%-,\.\/;->@\[-\^`\{-~]+(?=([=~}\s\/.)|]))))/,/^(?:\[(\\\]|[^\]])*\])/,/^(?:.)/,/^(?:$)/];lexer.conditions={"mu":{"rules":[7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44],"inclusive":false},"emu":{"rules":[2],"inclusive":false},"com":{"rules":[6],"inclusive":false},"raw":{"rules":[3,4,5],"inclusive":false},"INITIAL":{"rules":[0,1,44],"inclusive":true}};return lexer;})();parser.lexer=lexer;function Parser(){this.yy={};}Parser.prototype=parser;parser.Parser=Parser;return new Parser();})();exports["default"]=handlebars;module.exports=exports["default"];}),(function(module,exports,__webpack_require__){'use strict';var _interopRequireDefault=__webpack_require__(1)['default'];exports.__esModule=true;var _visitor=__webpack_require__(39);var _visitor2=_interopRequireDefault(_visitor);function WhitespaceControl(){var options=arguments.length<=0||arguments[0]===undefined?{}:arguments[0];this.options=options;}
WhitespaceControl.prototype=new _visitor2['default']();WhitespaceControl.prototype.Program=function(program){var doStandalone=!this.options.ignoreStandalone;var isRoot=!this.isRootSeen;this.isRootSeen=true;var body=program.body;for(var i=0,l=body.length;i<l;i++){var current=body[i],strip=this.accept(current);if(!strip){continue;}
var _isPrevWhitespace=isPrevWhitespace(body,i,isRoot),_isNextWhitespace=isNextWhitespace(body,i,isRoot),openStandalone=strip.openStandalone&&_isPrevWhitespace,closeStandalone=strip.closeStandalone&&_isNextWhitespace,inlineStandalone=strip.inlineStandalone&&_isPrevWhitespace&&_isNextWhitespace;if(strip.close){omitRight(body,i,true);}
if(strip.open){omitLeft(body,i,true);}
if(doStandalone&&inlineStandalone){omitRight(body,i);if(omitLeft(body,i)){if(current.type==='PartialStatement'){current.indent=/([ \t]+$)/.exec(body[i-1].original)[1];}}}
if(doStandalone&&openStandalone){omitRight((current.program||current.inverse).body);omitLeft(body,i);}
if(doStandalone&&closeStandalone){omitRight(body,i);omitLeft((current.inverse||current.program).body);}}
return program;};WhitespaceControl.prototype.BlockStatement=WhitespaceControl.prototype.DecoratorBlock=WhitespaceControl.prototype.PartialBlockStatement=function(block){this.accept(block.program);this.accept(block.inverse);var program=block.program||block.inverse,inverse=block.program&&block.inverse,firstInverse=inverse,lastInverse=inverse;if(inverse&&inverse.chained){firstInverse=inverse.body[0].program;while(lastInverse.chained){lastInverse=lastInverse.body[lastInverse.body.length-1].program;}}
var strip={open:block.openStrip.open,close:block.closeStrip.close,openStandalone:isNextWhitespace(program.body),closeStandalone:isPrevWhitespace((firstInverse||program).body)};if(block.openStrip.close){omitRight(program.body,null,true);}
if(inverse){var inverseStrip=block.inverseStrip;if(inverseStrip.open){omitLeft(program.body,null,true);}
if(inverseStrip.close){omitRight(firstInverse.body,null,true);}
if(block.closeStrip.open){omitLeft(lastInverse.body,null,true);}
if(!this.options.ignoreStandalone&&isPrevWhitespace(program.body)&&isNextWhitespace(firstInverse.body)){omitLeft(program.body);omitRight(firstInverse.body);}}else if(block.closeStrip.open){omitLeft(program.body,null,true);}
return strip;};WhitespaceControl.prototype.Decorator=WhitespaceControl.prototype.MustacheStatement=function(mustache){return mustache.strip;};WhitespaceControl.prototype.PartialStatement=WhitespaceControl.prototype.CommentStatement=function(node){var strip=node.strip||{};return{inlineStandalone:true,open:strip.open,close:strip.close};};function isPrevWhitespace(body,i,isRoot){if(i===undefined){i=body.length;}
var prev=body[i-1],sibling=body[i-2];if(!prev){return isRoot;}
if(prev.type==='ContentStatement'){return(sibling||!isRoot?/\r?\n\s*?$/:/(^|\r?\n)\s*?$/).test(prev.original);}}
function isNextWhitespace(body,i,isRoot){if(i===undefined){i=-1;}
var next=body[i+1],sibling=body[i+2];if(!next){return isRoot;}
if(next.type==='ContentStatement'){return(sibling||!isRoot?/^\s*?\r?\n/:/^\s*?(\r?\n|$)/).test(next.original);}}
function omitRight(body,i,multiple){var current=body[i==null?0:i+1];if(!current||current.type!=='ContentStatement'||!multiple&&current.rightStripped){return;}
var original=current.value;current.value=current.value.replace(multiple?/^\s+/:/^[ \t]*\r?\n?/,'');current.rightStripped=current.value!==original;}
function omitLeft(body,i,multiple){var current=body[i==null?body.length-1:i-1];if(!current||current.type!=='ContentStatement'||!multiple&&current.leftStripped){return;}
var original=current.value;current.value=current.value.replace(multiple?/\s+$/:/[ \t]+$/,'');current.leftStripped=current.value!==original;return current.leftStripped;}
exports['default']=WhitespaceControl;module.exports=exports['default'];}),(function(module,exports,__webpack_require__){'use strict';var _interopRequireDefault=__webpack_require__(1)['default'];exports.__esModule=true;var _exception=__webpack_require__(6);var _exception2=_interopRequireDefault(_exception);function Visitor(){this.parents=[];}
Visitor.prototype={constructor:Visitor,mutating:false,acceptKey:function acceptKey(node,name){var value=this.accept(node[name]);if(this.mutating){if(value&&!Visitor.prototype[value.type]){throw new _exception2['default']('Unexpected node type "'+value.type+'" found when accepting '+name+' on '+node.type);}
node[name]=value;}},acceptRequired:function acceptRequired(node,name){this.acceptKey(node,name);if(!node[name]){throw new _exception2['default'](node.type+' requires '+name);}},acceptArray:function acceptArray(array){for(var i=0,l=array.length;i<l;i++){this.acceptKey(array,i);if(!array[i]){array.splice(i,1);i--;l--;}}},accept:function accept(object){if(!object){return;}
if(!this[object.type]){throw new _exception2['default']('Unknown type: '+object.type,object);}
if(this.current){this.parents.unshift(this.current);}
this.current=object;var ret=this[object.type](object);this.current=this.parents.shift();if(!this.mutating||ret){return ret;}else if(ret!==false){return object;}},Program:function Program(program){this.acceptArray(program.body);},MustacheStatement:visitSubExpression,Decorator:visitSubExpression,BlockStatement:visitBlock,DecoratorBlock:visitBlock,PartialStatement:visitPartial,PartialBlockStatement:function PartialBlockStatement(partial){visitPartial.call(this,partial);this.acceptKey(partial,'program');},ContentStatement:function ContentStatement(){},CommentStatement:function CommentStatement(){},SubExpression:visitSubExpression,PathExpression:function PathExpression(){},StringLiteral:function StringLiteral(){},NumberLiteral:function NumberLiteral(){},BooleanLiteral:function BooleanLiteral(){},UndefinedLiteral:function UndefinedLiteral(){},NullLiteral:function NullLiteral(){},Hash:function Hash(hash){this.acceptArray(hash.pairs);},HashPair:function HashPair(pair){this.acceptRequired(pair,'value');}};function visitSubExpression(mustache){this.acceptRequired(mustache,'path');this.acceptArray(mustache.params);this.acceptKey(mustache,'hash');}
function visitBlock(block){visitSubExpression.call(this,block);this.acceptKey(block,'program');this.acceptKey(block,'inverse');}
function visitPartial(partial){this.acceptRequired(partial,'name');this.acceptArray(partial.params);this.acceptKey(partial,'hash');}
exports['default']=Visitor;module.exports=exports['default'];}),(function(module,exports,__webpack_require__){'use strict';var _interopRequireDefault=__webpack_require__(1)['default'];exports.__esModule=true;exports.SourceLocation=SourceLocation;exports.id=id;exports.stripFlags=stripFlags;exports.stripComment=stripComment;exports.preparePath=preparePath;exports.prepareMustache=prepareMustache;exports.prepareRawBlock=prepareRawBlock;exports.prepareBlock=prepareBlock;exports.prepareProgram=prepareProgram;exports.preparePartialBlock=preparePartialBlock;var _exception=__webpack_require__(6);var _exception2=_interopRequireDefault(_exception);function validateClose(open,close){close=close.path?close.path.original:close;if(open.path.original!==close){var errorNode={loc:open.path.loc};throw new _exception2['default'](open.path.original+" doesn't match "+close,errorNode);}}
function SourceLocation(source,locInfo){this.source=source;this.start={line:locInfo.first_line,column:locInfo.first_column};this.end={line:locInfo.last_line,column:locInfo.last_column};}
function id(token){if(/^\[.*\]$/.test(token)){return token.substr(1,token.length-2);}else{return token;}}
function stripFlags(open,close){return{open:open.charAt(2)==='~',close:close.charAt(close.length-3)==='~'};}
function stripComment(comment){return comment.replace(/^\{\{~?\!-?-?/,'').replace(/-?-?~?\}\}$/,'');}
function preparePath(data,parts,loc){loc=this.locInfo(loc);var original=data?'@':'',dig=[],depth=0,depthString='';for(var i=0,l=parts.length;i<l;i++){var part=parts[i].part,isLiteral=parts[i].original!==part;original+=(parts[i].separator||'')+part;if(!isLiteral&&(part==='..'||part==='.'||part==='this')){if(dig.length>0){throw new _exception2['default']('Invalid path: '+original,{loc:loc});}else if(part==='..'){depth++;depthString+='../';}}else{dig.push(part);}}
return{type:'PathExpression',data:data,depth:depth,parts:dig,original:original,loc:loc};}
function prepareMustache(path,params,hash,open,strip,locInfo){var escapeFlag=open.charAt(3)||open.charAt(2),escaped=escapeFlag!=='{'&&escapeFlag!=='&';var decorator=/\*/.test(open);return{type:decorator?'Decorator':'MustacheStatement',path:path,params:params,hash:hash,escaped:escaped,strip:strip,loc:this.locInfo(locInfo)};}
function prepareRawBlock(openRawBlock,contents,close,locInfo){validateClose(openRawBlock,close);locInfo=this.locInfo(locInfo);var program={type:'Program',body:contents,strip:{},loc:locInfo};return{type:'BlockStatement',path:openRawBlock.path,params:openRawBlock.params,hash:openRawBlock.hash,program:program,openStrip:{},inverseStrip:{},closeStrip:{},loc:locInfo};}
function prepareBlock(openBlock,program,inverseAndProgram,close,inverted,locInfo){if(close&&close.path){validateClose(openBlock,close);}
var decorator=/\*/.test(openBlock.open);program.blockParams=openBlock.blockParams;var inverse=undefined,inverseStrip=undefined;if(inverseAndProgram){if(decorator){throw new _exception2['default']('Unexpected inverse block on decorator',inverseAndProgram);}
if(inverseAndProgram.chain){inverseAndProgram.program.body[0].closeStrip=close.strip;}
inverseStrip=inverseAndProgram.strip;inverse=inverseAndProgram.program;}
if(inverted){inverted=inverse;inverse=program;program=inverted;}
return{type:decorator?'DecoratorBlock':'BlockStatement',path:openBlock.path,params:openBlock.params,hash:openBlock.hash,program:program,inverse:inverse,openStrip:openBlock.strip,inverseStrip:inverseStrip,closeStrip:close&&close.strip,loc:this.locInfo(locInfo)};}
function prepareProgram(statements,loc){if(!loc&&statements.length){var firstLoc=statements[0].loc,lastLoc=statements[statements.length-1].loc;if(firstLoc&&lastLoc){loc={source:firstLoc.source,start:{line:firstLoc.start.line,column:firstLoc.start.column},end:{line:lastLoc.end.line,column:lastLoc.end.column}};}}
return{type:'Program',body:statements,strip:{},loc:loc};}
function preparePartialBlock(open,program,close,locInfo){validateClose(open,close);return{type:'PartialBlockStatement',name:open.path,params:open.params,hash:open.hash,program:program,openStrip:open.strip,closeStrip:close&&close.strip,loc:this.locInfo(locInfo)};}}),(function(module,exports,__webpack_require__){'use strict';var _interopRequireDefault=__webpack_require__(1)['default'];exports.__esModule=true;exports.Compiler=Compiler;exports.precompile=precompile;exports.compile=compile;var _exception=__webpack_require__(6);var _exception2=_interopRequireDefault(_exception);var _utils=__webpack_require__(5);var _ast=__webpack_require__(35);var _ast2=_interopRequireDefault(_ast);var slice=[].slice;function Compiler(){}
Compiler.prototype={compiler:Compiler,equals:function equals(other){var len=this.opcodes.length;if(other.opcodes.length!==len){return false;}
for(var i=0;i<len;i++){var opcode=this.opcodes[i],otherOpcode=other.opcodes[i];if(opcode.opcode!==otherOpcode.opcode||!argEquals(opcode.args,otherOpcode.args)){return false;}}
len=this.children.length;for(var i=0;i<len;i++){if(!this.children[i].equals(other.children[i])){return false;}}
return true;},guid:0,compile:function compile(program,options){this.sourceNode=[];this.opcodes=[];this.children=[];this.options=options;this.stringParams=options.stringParams;this.trackIds=options.trackIds;options.blockParams=options.blockParams||[];var knownHelpers=options.knownHelpers;options.knownHelpers={'helperMissing':true,'blockHelperMissing':true,'each':true,'if':true,'unless':true,'with':true,'log':true,'lookup':true};if(knownHelpers){for(var _name in knownHelpers){if(_name in knownHelpers){this.options.knownHelpers[_name]=knownHelpers[_name];}}}
return this.accept(program);},compileProgram:function compileProgram(program){var childCompiler=new this.compiler(),result=childCompiler.compile(program,this.options),guid=this.guid++;this.usePartial=this.usePartial||result.usePartial;this.children[guid]=result;this.useDepths=this.useDepths||result.useDepths;return guid;},accept:function accept(node){if(!this[node.type]){throw new _exception2['default']('Unknown type: '+node.type,node);}
this.sourceNode.unshift(node);var ret=this[node.type](node);this.sourceNode.shift();return ret;},Program:function Program(program){this.options.blockParams.unshift(program.blockParams);var body=program.body,bodyLength=body.length;for(var i=0;i<bodyLength;i++){this.accept(body[i]);}
this.options.blockParams.shift();this.isSimple=bodyLength===1;this.blockParams=program.blockParams?program.blockParams.length:0;return this;},BlockStatement:function BlockStatement(block){transformLiteralToPath(block);var program=block.program,inverse=block.inverse;program=program&&this.compileProgram(program);inverse=inverse&&this.compileProgram(inverse);var type=this.classifySexpr(block);if(type==='helper'){this.helperSexpr(block,program,inverse);}else if(type==='simple'){this.simpleSexpr(block);this.opcode('pushProgram',program);this.opcode('pushProgram',inverse);this.opcode('emptyHash');this.opcode('blockValue',block.path.original);}else{this.ambiguousSexpr(block,program,inverse);this.opcode('pushProgram',program);this.opcode('pushProgram',inverse);this.opcode('emptyHash');this.opcode('ambiguousBlockValue');}
this.opcode('append');},DecoratorBlock:function DecoratorBlock(decorator){var program=decorator.program&&this.compileProgram(decorator.program);var params=this.setupFullMustacheParams(decorator,program,undefined),path=decorator.path;this.useDecorators=true;this.opcode('registerDecorator',params.length,path.original);},PartialStatement:function PartialStatement(partial){this.usePartial=true;var program=partial.program;if(program){program=this.compileProgram(partial.program);}
var params=partial.params;if(params.length>1){throw new _exception2['default']('Unsupported number of partial arguments: '+params.length,partial);}else if(!params.length){if(this.options.explicitPartialContext){this.opcode('pushLiteral','undefined');}else{params.push({type:'PathExpression',parts:[],depth:0});}}
var partialName=partial.name.original,isDynamic=partial.name.type==='SubExpression';if(isDynamic){this.accept(partial.name);}
this.setupFullMustacheParams(partial,program,undefined,true);var indent=partial.indent||'';if(this.options.preventIndent&&indent){this.opcode('appendContent',indent);indent='';}
this.opcode('invokePartial',isDynamic,partialName,indent);this.opcode('append');},PartialBlockStatement:function PartialBlockStatement(partialBlock){this.PartialStatement(partialBlock);},MustacheStatement:function MustacheStatement(mustache){this.SubExpression(mustache);if(mustache.escaped&&!this.options.noEscape){this.opcode('appendEscaped');}else{this.opcode('append');}},Decorator:function Decorator(decorator){this.DecoratorBlock(decorator);},ContentStatement:function ContentStatement(content){if(content.value){this.opcode('appendContent',content.value);}},CommentStatement:function CommentStatement(){},SubExpression:function SubExpression(sexpr){transformLiteralToPath(sexpr);var type=this.classifySexpr(sexpr);if(type==='simple'){this.simpleSexpr(sexpr);}else if(type==='helper'){this.helperSexpr(sexpr);}else{this.ambiguousSexpr(sexpr);}},ambiguousSexpr:function ambiguousSexpr(sexpr,program,inverse){var path=sexpr.path,name=path.parts[0],isBlock=program!=null||inverse!=null;this.opcode('getContext',path.depth);this.opcode('pushProgram',program);this.opcode('pushProgram',inverse);path.strict=true;this.accept(path);this.opcode('invokeAmbiguous',name,isBlock);},simpleSexpr:function simpleSexpr(sexpr){var path=sexpr.path;path.strict=true;this.accept(path);this.opcode('resolvePossibleLambda');},helperSexpr:function helperSexpr(sexpr,program,inverse){var params=this.setupFullMustacheParams(sexpr,program,inverse),path=sexpr.path,name=path.parts[0];if(this.options.knownHelpers[name]){this.opcode('invokeKnownHelper',params.length,name);}else if(this.options.knownHelpersOnly){throw new _exception2['default']('You specified knownHelpersOnly, but used the unknown helper '+name,sexpr);}else{path.strict=true;path.falsy=true;this.accept(path);this.opcode('invokeHelper',params.length,path.original,_ast2['default'].helpers.simpleId(path));}},PathExpression:function PathExpression(path){this.addDepth(path.depth);this.opcode('getContext',path.depth);var name=path.parts[0],scoped=_ast2['default'].helpers.scopedId(path),blockParamId=!path.depth&&!scoped&&this.blockParamIndex(name);if(blockParamId){this.opcode('lookupBlockParam',blockParamId,path.parts);}else if(!name){this.opcode('pushContext');}else if(path.data){this.options.data=true;this.opcode('lookupData',path.depth,path.parts,path.strict);}else{this.opcode('lookupOnContext',path.parts,path.falsy,path.strict,scoped);}},StringLiteral:function StringLiteral(string){this.opcode('pushString',string.value);},NumberLiteral:function NumberLiteral(number){this.opcode('pushLiteral',number.value);},BooleanLiteral:function BooleanLiteral(bool){this.opcode('pushLiteral',bool.value);},UndefinedLiteral:function UndefinedLiteral(){this.opcode('pushLiteral','undefined');},NullLiteral:function NullLiteral(){this.opcode('pushLiteral','null');},Hash:function Hash(hash){var pairs=hash.pairs,i=0,l=pairs.length;this.opcode('pushHash');for(;i<l;i++){this.pushParam(pairs[i].value);}
while(i--){this.opcode('assignToHash',pairs[i].key);}
this.opcode('popHash');},opcode:function opcode(name){this.opcodes.push({opcode:name,args:slice.call(arguments,1),loc:this.sourceNode[0].loc});},addDepth:function addDepth(depth){if(!depth){return;}
this.useDepths=true;},classifySexpr:function classifySexpr(sexpr){var isSimple=_ast2['default'].helpers.simpleId(sexpr.path);var isBlockParam=isSimple&&!!this.blockParamIndex(sexpr.path.parts[0]);var isHelper=!isBlockParam&&_ast2['default'].helpers.helperExpression(sexpr);var isEligible=!isBlockParam&&(isHelper||isSimple);if(isEligible&&!isHelper){var _name2=sexpr.path.parts[0],options=this.options;if(options.knownHelpers[_name2]){isHelper=true;}else if(options.knownHelpersOnly){isEligible=false;}}
if(isHelper){return 'helper';}else if(isEligible){return 'ambiguous';}else{return 'simple';}},pushParams:function pushParams(params){for(var i=0,l=params.length;i<l;i++){this.pushParam(params[i]);}},pushParam:function pushParam(val){var value=val.value!=null?val.value:val.original||'';if(this.stringParams){if(value.replace){value=value.replace(/^(\.?\.\/)*/g,'').replace(/\//g,'.');}
if(val.depth){this.addDepth(val.depth);}
this.opcode('getContext',val.depth||0);this.opcode('pushStringParam',value,val.type);if(val.type==='SubExpression'){this.accept(val);}}else{if(this.trackIds){var blockParamIndex=undefined;if(val.parts&&!_ast2['default'].helpers.scopedId(val)&&!val.depth){blockParamIndex=this.blockParamIndex(val.parts[0]);}
if(blockParamIndex){var blockParamChild=val.parts.slice(1).join('.');this.opcode('pushId','BlockParam',blockParamIndex,blockParamChild);}else{value=val.original||value;if(value.replace){value=value.replace(/^this(?:\.|$)/,'').replace(/^\.\//,'').replace(/^\.$/,'');}
this.opcode('pushId',val.type,value);}}
this.accept(val);}},setupFullMustacheParams:function setupFullMustacheParams(sexpr,program,inverse,omitEmpty){var params=sexpr.params;this.pushParams(params);this.opcode('pushProgram',program);this.opcode('pushProgram',inverse);if(sexpr.hash){this.accept(sexpr.hash);}else{this.opcode('emptyHash',omitEmpty);}
return params;},blockParamIndex:function blockParamIndex(name){for(var depth=0,len=this.options.blockParams.length;depth<len;depth++){var blockParams=this.options.blockParams[depth],param=blockParams&&_utils.indexOf(blockParams,name);if(blockParams&&param>=0){return[depth,param];}}}};function precompile(input,options,env){if(input==null||typeof input!=='string'&&input.type!=='Program'){throw new _exception2['default']('You must pass a string or Handlebars AST to Handlebars.precompile. You passed '+input);}
options=options||{};if(!('data'in options)){options.data=true;}
if(options.compat){options.useDepths=true;}
var ast=env.parse(input,options),environment=new env.Compiler().compile(ast,options);return new env.JavaScriptCompiler().compile(environment,options);}
function compile(input,options,env){if(options===undefined)options={};if(input==null||typeof input!=='string'&&input.type!=='Program'){throw new _exception2['default']('You must pass a string or Handlebars AST to Handlebars.compile. You passed '+input);}
options=_utils.extend({},options);if(!('data'in options)){options.data=true;}
if(options.compat){options.useDepths=true;}
var compiled=undefined;function compileInput(){var ast=env.parse(input,options),environment=new env.Compiler().compile(ast,options),templateSpec=new env.JavaScriptCompiler().compile(environment,options,undefined,true);return env.template(templateSpec);}
function ret(context,execOptions){if(!compiled){compiled=compileInput();}
return compiled.call(this,context,execOptions);}
ret._setup=function(setupOptions){if(!compiled){compiled=compileInput();}
return compiled._setup(setupOptions);};ret._child=function(i,data,blockParams,depths){if(!compiled){compiled=compileInput();}
return compiled._child(i,data,blockParams,depths);};return ret;}
function argEquals(a,b){if(a===b){return true;}
if(_utils.isArray(a)&&_utils.isArray(b)&&a.length===b.length){for(var i=0;i<a.length;i++){if(!argEquals(a[i],b[i])){return false;}}
return true;}}
function transformLiteralToPath(sexpr){if(!sexpr.path.parts){var literal=sexpr.path;sexpr.path={type:'PathExpression',data:false,depth:0,parts:[literal.original+''],original:literal.original+'',loc:literal.loc};}}}),(function(module,exports,__webpack_require__){'use strict';var _interopRequireDefault=__webpack_require__(1)['default'];exports.__esModule=true;var _base=__webpack_require__(4);var _exception=__webpack_require__(6);var _exception2=_interopRequireDefault(_exception);var _utils=__webpack_require__(5);var _codeGen=__webpack_require__(43);var _codeGen2=_interopRequireDefault(_codeGen);function Literal(value){this.value=value;}
function JavaScriptCompiler(){}
JavaScriptCompiler.prototype={nameLookup:function nameLookup(parent,name){if(JavaScriptCompiler.isValidJavaScriptVariableName(name)){return[parent,'.',name];}else{return[parent,'[',JSON.stringify(name),']'];}},depthedLookup:function depthedLookup(name){return[this.aliasable('container.lookup'),'(depths, "',name,'")'];},compilerInfo:function compilerInfo(){var revision=_base.COMPILER_REVISION,versions=_base.REVISION_CHANGES[revision];return[revision,versions];},appendToBuffer:function appendToBuffer(source,location,explicit){if(!_utils.isArray(source)){source=[source];}
source=this.source.wrap(source,location);if(this.environment.isSimple){return['return ',source,';'];}else if(explicit){return['buffer += ',source,';'];}else{source.appendToBuffer=true;return source;}},initializeBuffer:function initializeBuffer(){return this.quotedString('');},compile:function compile(environment,options,context,asObject){this.environment=environment;this.options=options;this.stringParams=this.options.stringParams;this.trackIds=this.options.trackIds;this.precompile=!asObject;this.name=this.environment.name;this.isChild=!!context;this.context=context||{decorators:[],programs:[],environments:[]};this.preamble();this.stackSlot=0;this.stackVars=[];this.aliases={};this.registers={list:[]};this.hashes=[];this.compileStack=[];this.inlineStack=[];this.blockParams=[];this.compileChildren(environment,options);this.useDepths=this.useDepths||environment.useDepths||environment.useDecorators||this.options.compat;this.useBlockParams=this.useBlockParams||environment.useBlockParams;var opcodes=environment.opcodes,opcode=undefined,firstLoc=undefined,i=undefined,l=undefined;for(i=0,l=opcodes.length;i<l;i++){opcode=opcodes[i];this.source.currentLocation=opcode.loc;firstLoc=firstLoc||opcode.loc;this[opcode.opcode].apply(this,opcode.args);}
this.source.currentLocation=firstLoc;this.pushSource('');if(this.stackSlot||this.inlineStack.length||this.compileStack.length){throw new _exception2['default']('Compile completed with content left on stack');}
if(!this.decorators.isEmpty()){this.useDecorators=true;this.decorators.prepend('var decorators = container.decorators;\n');this.decorators.push('return fn;');if(asObject){this.decorators=Function.apply(this,['fn','props','container','depth0','data','blockParams','depths',this.decorators.merge()]);}else{this.decorators.prepend('function(fn, props, container, depth0, data, blockParams, depths) {\n');this.decorators.push('}\n');this.decorators=this.decorators.merge();}}else{this.decorators=undefined;}
var fn=this.createFunctionContext(asObject);if(!this.isChild){var ret={compiler:this.compilerInfo(),main:fn};if(this.decorators){ret.main_d=this.decorators;ret.useDecorators=true;}
var _context=this.context;var programs=_context.programs;var decorators=_context.decorators;for(i=0,l=programs.length;i<l;i++){if(programs[i]){ret[i]=programs[i];if(decorators[i]){ret[i+'_d']=decorators[i];ret.useDecorators=true;}}}
if(this.environment.usePartial){ret.usePartial=true;}
if(this.options.data){ret.useData=true;}
if(this.useDepths){ret.useDepths=true;}
if(this.useBlockParams){ret.useBlockParams=true;}
if(this.options.compat){ret.compat=true;}
if(!asObject){ret.compiler=JSON.stringify(ret.compiler);this.source.currentLocation={start:{line:1,column:0}};ret=this.objectLiteral(ret);if(options.srcName){ret=ret.toStringWithSourceMap({file:options.destName});ret.map=ret.map&&ret.map.toString();}else{ret=ret.toString();}}else{ret.compilerOptions=this.options;}
return ret;}else{return fn;}},preamble:function preamble(){this.lastContext=0;this.source=new _codeGen2['default'](this.options.srcName);this.decorators=new _codeGen2['default'](this.options.srcName);},createFunctionContext:function createFunctionContext(asObject){var varDeclarations='';var locals=this.stackVars.concat(this.registers.list);if(locals.length>0){varDeclarations+=', '+locals.join(', ');}
var aliasCount=0;for(var alias in this.aliases){var node=this.aliases[alias];if(this.aliases.hasOwnProperty(alias)&&node.children&&node.referenceCount>1){varDeclarations+=', alias'+ ++aliasCount+'='+alias;node.children[0]='alias'+aliasCount;}}
var params=['container','depth0','helpers','partials','data'];if(this.useBlockParams||this.useDepths){params.push('blockParams');}
if(this.useDepths){params.push('depths');}
var source=this.mergeSource(varDeclarations);if(asObject){params.push(source);return Function.apply(this,params);}else{return this.source.wrap(['function(',params.join(','),') {\n  ',source,'}']);}},mergeSource:function mergeSource(varDeclarations){var isSimple=this.environment.isSimple,appendOnly=!this.forceBuffer,appendFirst=undefined,sourceSeen=undefined,bufferStart=undefined,bufferEnd=undefined;this.source.each(function(line){if(line.appendToBuffer){if(bufferStart){line.prepend('  + ');}else{bufferStart=line;}
bufferEnd=line;}else{if(bufferStart){if(!sourceSeen){appendFirst=true;}else{bufferStart.prepend('buffer += ');}
bufferEnd.add(';');bufferStart=bufferEnd=undefined;}
sourceSeen=true;if(!isSimple){appendOnly=false;}}});if(appendOnly){if(bufferStart){bufferStart.prepend('return ');bufferEnd.add(';');}else if(!sourceSeen){this.source.push('return "";');}}else{varDeclarations+=', buffer = '+(appendFirst?'':this.initializeBuffer());if(bufferStart){bufferStart.prepend('return buffer + ');bufferEnd.add(';');}else{this.source.push('return buffer;');}}
if(varDeclarations){this.source.prepend('var '+varDeclarations.substring(2)+(appendFirst?'':';\n'));}
return this.source.merge();},blockValue:function blockValue(name){var blockHelperMissing=this.aliasable('helpers.blockHelperMissing'),params=[this.contextName(0)];this.setupHelperArgs(name,0,params);var blockName=this.popStack();params.splice(1,0,blockName);this.push(this.source.functionCall(blockHelperMissing,'call',params));},ambiguousBlockValue:function ambiguousBlockValue(){var blockHelperMissing=this.aliasable('helpers.blockHelperMissing'),params=[this.contextName(0)];this.setupHelperArgs('',0,params,true);this.flushInline();var current=this.topStack();params.splice(1,0,current);this.pushSource(['if (!',this.lastHelper,') { ',current,' = ',this.source.functionCall(blockHelperMissing,'call',params),'}']);},appendContent:function appendContent(content){if(this.pendingContent){content=this.pendingContent+content;}else{this.pendingLocation=this.source.currentLocation;}
this.pendingContent=content;},append:function append(){if(this.isInline()){this.replaceStack(function(current){return[' != null ? ',current,' : ""'];});this.pushSource(this.appendToBuffer(this.popStack()));}else{var local=this.popStack();this.pushSource(['if (',local,' != null) { ',this.appendToBuffer(local,undefined,true),' }']);if(this.environment.isSimple){this.pushSource(['else { ',this.appendToBuffer("''",undefined,true),' }']);}}},appendEscaped:function appendEscaped(){this.pushSource(this.appendToBuffer([this.aliasable('container.escapeExpression'),'(',this.popStack(),')']));},getContext:function getContext(depth){this.lastContext=depth;},pushContext:function pushContext(){this.pushStackLiteral(this.contextName(this.lastContext));},lookupOnContext:function lookupOnContext(parts,falsy,strict,scoped){var i=0;if(!scoped&&this.options.compat&&!this.lastContext){this.push(this.depthedLookup(parts[i++]));}else{this.pushContext();}
this.resolvePath('context',parts,i,falsy,strict);},lookupBlockParam:function lookupBlockParam(blockParamId,parts){this.useBlockParams=true;this.push(['blockParams[',blockParamId[0],'][',blockParamId[1],']']);this.resolvePath('context',parts,1);},lookupData:function lookupData(depth,parts,strict){if(!depth){this.pushStackLiteral('data');}else{this.pushStackLiteral('container.data(data, '+depth+')');}
this.resolvePath('data',parts,0,true,strict);},resolvePath:function resolvePath(type,parts,i,falsy,strict){var _this=this;if(this.options.strict||this.options.assumeObjects){this.push(strictLookup(this.options.strict&&strict,this,parts,type));return;}
var len=parts.length;for(;i<len;i++){this.replaceStack(function(current){var lookup=_this.nameLookup(current,parts[i],type);if(!falsy){return[' != null ? ',lookup,' : ',current];}else{return[' && ',lookup];}});}},resolvePossibleLambda:function resolvePossibleLambda(){this.push([this.aliasable('container.lambda'),'(',this.popStack(),', ',this.contextName(0),')']);},pushStringParam:function pushStringParam(string,type){this.pushContext();this.pushString(type);if(type!=='SubExpression'){if(typeof string==='string'){this.pushString(string);}else{this.pushStackLiteral(string);}}},emptyHash:function emptyHash(omitEmpty){if(this.trackIds){this.push('{}');}
if(this.stringParams){this.push('{}');this.push('{}');}
this.pushStackLiteral(omitEmpty?'undefined':'{}');},pushHash:function pushHash(){if(this.hash){this.hashes.push(this.hash);}
this.hash={values:[],types:[],contexts:[],ids:[]};},popHash:function popHash(){var hash=this.hash;this.hash=this.hashes.pop();if(this.trackIds){this.push(this.objectLiteral(hash.ids));}
if(this.stringParams){this.push(this.objectLiteral(hash.contexts));this.push(this.objectLiteral(hash.types));}
this.push(this.objectLiteral(hash.values));},pushString:function pushString(string){this.pushStackLiteral(this.quotedString(string));},pushLiteral:function pushLiteral(value){this.pushStackLiteral(value);},pushProgram:function pushProgram(guid){if(guid!=null){this.pushStackLiteral(this.programExpression(guid));}else{this.pushStackLiteral(null);}},registerDecorator:function registerDecorator(paramSize,name){var foundDecorator=this.nameLookup('decorators',name,'decorator'),options=this.setupHelperArgs(name,paramSize);this.decorators.push(['fn = ',this.decorators.functionCall(foundDecorator,'',['fn','props','container',options]),' || fn;']);},invokeHelper:function invokeHelper(paramSize,name,isSimple){var nonHelper=this.popStack(),helper=this.setupHelper(paramSize,name),simple=isSimple?[helper.name,' || ']:'';var lookup=['('].concat(simple,nonHelper);if(!this.options.strict){lookup.push(' || ',this.aliasable('helpers.helperMissing'));}
lookup.push(')');this.push(this.source.functionCall(lookup,'call',helper.callParams));},invokeKnownHelper:function invokeKnownHelper(paramSize,name){var helper=this.setupHelper(paramSize,name);this.push(this.source.functionCall(helper.name,'call',helper.callParams));},invokeAmbiguous:function invokeAmbiguous(name,helperCall){this.useRegister('helper');var nonHelper=this.popStack();this.emptyHash();var helper=this.setupHelper(0,name,helperCall);var helperName=this.lastHelper=this.nameLookup('helpers',name,'helper');var lookup=['(','(helper = ',helperName,' || ',nonHelper,')'];if(!this.options.strict){lookup[0]='(helper = ';lookup.push(' != null ? helper : ',this.aliasable('helpers.helperMissing'));}
this.push(['(',lookup,helper.paramsInit?['),(',helper.paramsInit]:[],'),','(typeof helper === ',this.aliasable('"function"'),' ? ',this.source.functionCall('helper','call',helper.callParams),' : helper))']);},invokePartial:function invokePartial(isDynamic,name,indent){var params=[],options=this.setupParams(name,1,params);if(isDynamic){name=this.popStack();delete options.name;}
if(indent){options.indent=JSON.stringify(indent);}
options.helpers='helpers';options.partials='partials';options.decorators='container.decorators';if(!isDynamic){params.unshift(this.nameLookup('partials',name,'partial'));}else{params.unshift(name);}
if(this.options.compat){options.depths='depths';}
options=this.objectLiteral(options);params.push(options);this.push(this.source.functionCall('container.invokePartial','',params));},assignToHash:function assignToHash(key){var value=this.popStack(),context=undefined,type=undefined,id=undefined;if(this.trackIds){id=this.popStack();}
if(this.stringParams){type=this.popStack();context=this.popStack();}
var hash=this.hash;if(context){hash.contexts[key]=context;}
if(type){hash.types[key]=type;}
if(id){hash.ids[key]=id;}
hash.values[key]=value;},pushId:function pushId(type,name,child){if(type==='BlockParam'){this.pushStackLiteral('blockParams['+name[0]+'].path['+name[1]+']'+(child?' + '+JSON.stringify('.'+child):''));}else if(type==='PathExpression'){this.pushString(name);}else if(type==='SubExpression'){this.pushStackLiteral('true');}else{this.pushStackLiteral('null');}},compiler:JavaScriptCompiler,compileChildren:function compileChildren(environment,options){var children=environment.children,child=undefined,compiler=undefined;for(var i=0,l=children.length;i<l;i++){child=children[i];compiler=new this.compiler();var existing=this.matchExistingProgram(child);if(existing==null){this.context.programs.push('');var index=this.context.programs.length;child.index=index;child.name='program'+index;this.context.programs[index]=compiler.compile(child,options,this.context,!this.precompile);this.context.decorators[index]=compiler.decorators;this.context.environments[index]=child;this.useDepths=this.useDepths||compiler.useDepths;this.useBlockParams=this.useBlockParams||compiler.useBlockParams;child.useDepths=this.useDepths;child.useBlockParams=this.useBlockParams;}else{child.index=existing.index;child.name='program'+existing.index;this.useDepths=this.useDepths||existing.useDepths;this.useBlockParams=this.useBlockParams||existing.useBlockParams;}}},matchExistingProgram:function matchExistingProgram(child){for(var i=0,len=this.context.environments.length;i<len;i++){var environment=this.context.environments[i];if(environment&&environment.equals(child)){return environment;}}},programExpression:function programExpression(guid){var child=this.environment.children[guid],programParams=[child.index,'data',child.blockParams];if(this.useBlockParams||this.useDepths){programParams.push('blockParams');}
if(this.useDepths){programParams.push('depths');}
return 'container.program('+programParams.join(', ')+')';},useRegister:function useRegister(name){if(!this.registers[name]){this.registers[name]=true;this.registers.list.push(name);}},push:function push(expr){if(!(expr instanceof Literal)){expr=this.source.wrap(expr);}
this.inlineStack.push(expr);return expr;},pushStackLiteral:function pushStackLiteral(item){this.push(new Literal(item));},pushSource:function pushSource(source){if(this.pendingContent){this.source.push(this.appendToBuffer(this.source.quotedString(this.pendingContent),this.pendingLocation));this.pendingContent=undefined;}
if(source){this.source.push(source);}},replaceStack:function replaceStack(callback){var prefix=['('],stack=undefined,createdStack=undefined,usedLiteral=undefined;if(!this.isInline()){throw new _exception2['default']('replaceStack on non-inline');}
var top=this.popStack(true);if(top instanceof Literal){stack=[top.value];prefix=['(',stack];usedLiteral=true;}else{createdStack=true;var _name=this.incrStack();prefix=['((',this.push(_name),' = ',top,')'];stack=this.topStack();}
var item=callback.call(this,stack);if(!usedLiteral){this.popStack();}
if(createdStack){this.stackSlot--;}
this.push(prefix.concat(item,')'));},incrStack:function incrStack(){this.stackSlot++;if(this.stackSlot>this.stackVars.length){this.stackVars.push('stack'+this.stackSlot);}
return this.topStackName();},topStackName:function topStackName(){return 'stack'+this.stackSlot;},flushInline:function flushInline(){var inlineStack=this.inlineStack;this.inlineStack=[];for(var i=0,len=inlineStack.length;i<len;i++){var entry=inlineStack[i];if(entry instanceof Literal){this.compileStack.push(entry);}else{var stack=this.incrStack();this.pushSource([stack,' = ',entry,';']);this.compileStack.push(stack);}}},isInline:function isInline(){return this.inlineStack.length;},popStack:function popStack(wrapped){var inline=this.isInline(),item=(inline?this.inlineStack:this.compileStack).pop();if(!wrapped&&item instanceof Literal){return item.value;}else{if(!inline){if(!this.stackSlot){throw new _exception2['default']('Invalid stack pop');}
this.stackSlot--;}
return item;}},topStack:function topStack(){var stack=this.isInline()?this.inlineStack:this.compileStack,item=stack[stack.length-1];if(item instanceof Literal){return item.value;}else{return item;}},contextName:function contextName(context){if(this.useDepths&&context){return 'depths['+context+']';}else{return 'depth'+context;}},quotedString:function quotedString(str){return this.source.quotedString(str);},objectLiteral:function objectLiteral(obj){return this.source.objectLiteral(obj);},aliasable:function aliasable(name){var ret=this.aliases[name];if(ret){ret.referenceCount++;return ret;}
ret=this.aliases[name]=this.source.wrap(name);ret.aliasable=true;ret.referenceCount=1;return ret;},setupHelper:function setupHelper(paramSize,name,blockHelper){var params=[],paramsInit=this.setupHelperArgs(name,paramSize,params,blockHelper);var foundHelper=this.nameLookup('helpers',name,'helper'),callContext=this.aliasable(this.contextName(0)+' != null ? '+this.contextName(0)+' : (container.nullContext || {})');return{params:params,paramsInit:paramsInit,name:foundHelper,callParams:[callContext].concat(params)};},setupParams:function setupParams(helper,paramSize,params){var options={},contexts=[],types=[],ids=[],objectArgs=!params,param=undefined;if(objectArgs){params=[];}
options.name=this.quotedString(helper);options.hash=this.popStack();if(this.trackIds){options.hashIds=this.popStack();}
if(this.stringParams){options.hashTypes=this.popStack();options.hashContexts=this.popStack();}
var inverse=this.popStack(),program=this.popStack();if(program||inverse){options.fn=program||'container.noop';options.inverse=inverse||'container.noop';}
var i=paramSize;while(i--){param=this.popStack();params[i]=param;if(this.trackIds){ids[i]=this.popStack();}
if(this.stringParams){types[i]=this.popStack();contexts[i]=this.popStack();}}
if(objectArgs){options.args=this.source.generateArray(params);}
if(this.trackIds){options.ids=this.source.generateArray(ids);}
if(this.stringParams){options.types=this.source.generateArray(types);options.contexts=this.source.generateArray(contexts);}
if(this.options.data){options.data='data';}
if(this.useBlockParams){options.blockParams='blockParams';}
return options;},setupHelperArgs:function setupHelperArgs(helper,paramSize,params,useRegister){var options=this.setupParams(helper,paramSize,params);options=this.objectLiteral(options);if(useRegister){this.useRegister('options');params.push('options');return['options=',options];}else if(params){params.push(options);return '';}else{return options;}}};(function(){var reservedWords=('break else new var'+' case finally return void'+' catch for switch while'+' continue function this with'+' default if throw'+' delete in try'+' do instanceof typeof'+' abstract enum int short'+' boolean export interface static'+' byte extends long super'+' char final native synchronized'+' class float package throws'+' const goto private transient'+' debugger implements protected volatile'+' double import public let yield await'+' null true false').split(' ');var compilerWords=JavaScriptCompiler.RESERVED_WORDS={};for(var i=0,l=reservedWords.length;i<l;i++){compilerWords[reservedWords[i]]=true;}})();JavaScriptCompiler.isValidJavaScriptVariableName=function(name){return!JavaScriptCompiler.RESERVED_WORDS[name]&&/^[a-zA-Z_$][0-9a-zA-Z_$]*$/.test(name);};function strictLookup(requireTerminal,compiler,parts,type){var stack=compiler.popStack(),i=0,len=parts.length;if(requireTerminal){len--;}
for(;i<len;i++){stack=compiler.nameLookup(stack,parts[i],type);}
if(requireTerminal){return[compiler.aliasable('container.strict'),'(',stack,', ',compiler.quotedString(parts[i]),')'];}else{return stack;}}
exports['default']=JavaScriptCompiler;module.exports=exports['default'];}),(function(module,exports,__webpack_require__){'use strict';exports.__esModule=true;var _utils=__webpack_require__(5);var SourceNode=undefined;try{if(false){var SourceMap=require('source-map');SourceNode=SourceMap.SourceNode;}}catch(err){}
if(!SourceNode){SourceNode=function(line,column,srcFile,chunks){this.src='';if(chunks){this.add(chunks);}};SourceNode.prototype={add:function add(chunks){if(_utils.isArray(chunks)){chunks=chunks.join('');}
this.src+=chunks;},prepend:function prepend(chunks){if(_utils.isArray(chunks)){chunks=chunks.join('');}
this.src=chunks+this.src;},toStringWithSourceMap:function toStringWithSourceMap(){return{code:this.toString()};},toString:function toString(){return this.src;}};}
function castChunk(chunk,codeGen,loc){if(_utils.isArray(chunk)){var ret=[];for(var i=0,len=chunk.length;i<len;i++){ret.push(codeGen.wrap(chunk[i],loc));}
return ret;}else if(typeof chunk==='boolean'||typeof chunk==='number'){return chunk+'';}
return chunk;}
function CodeGen(srcFile){this.srcFile=srcFile;this.source=[];}
CodeGen.prototype={isEmpty:function isEmpty(){return!this.source.length;},prepend:function prepend(source,loc){this.source.unshift(this.wrap(source,loc));},push:function push(source,loc){this.source.push(this.wrap(source,loc));},merge:function merge(){var source=this.empty();this.each(function(line){source.add(['  ',line,'\n']);});return source;},each:function each(iter){for(var i=0,len=this.source.length;i<len;i++){iter(this.source[i]);}},empty:function empty(){var loc=this.currentLocation||{start:{}};return new SourceNode(loc.start.line,loc.start.column,this.srcFile);},wrap:function wrap(chunk){var loc=arguments.length<=1||arguments[1]===undefined?this.currentLocation||{start:{}}:arguments[1];if(chunk instanceof SourceNode){return chunk;}
chunk=castChunk(chunk,this,loc);return new SourceNode(loc.start.line,loc.start.column,this.srcFile,chunk);},functionCall:function functionCall(fn,type,params){params=this.generateList(params);return this.wrap([fn,type?'.'+type+'(':'(',params,')']);},quotedString:function quotedString(str){return '"'+(str+'').replace(/\\/g,'\\\\').replace(/"/g,'\\"').replace(/\n/g,'\\n').replace(/\r/g,'\\r').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029')+'"';},objectLiteral:function objectLiteral(obj){var pairs=[];for(var key in obj){if(obj.hasOwnProperty(key)){var value=castChunk(obj[key],this);if(value!=='undefined'){pairs.push([this.quotedString(key),':',value]);}}}
var ret=this.generateList(pairs);ret.prepend('{');ret.add('}');return ret;},generateList:function generateList(entries){var ret=this.empty();for(var i=0,len=entries.length;i<len;i++){if(i){ret.add(',');}
ret.add(castChunk(entries[i],this));}
return ret;},generateArray:function generateArray(entries){var ret=this.generateList(entries);ret.prepend('[');ret.add(']');return ret;}};exports['default']=CodeGen;module.exports=exports['default'];})])});;!function(a,b){function c(b){var c,d=a("<div></div>").css({width:"100%"});return b.append(d),c=b.width()-d.width(),d.remove(),c}function d(e,f){var g=e.getBoundingClientRect(),h=g.top,i=g.bottom,j=g.left,k=g.right,l=a.extend({tolerance:0,viewport:b},f),m=!1,n=l.viewport.jquery?l.viewport:a(l.viewport);n.length||(console.warn("isInViewport: The viewport selector you have provided matches no element on page."),console.warn("isInViewport: Defaulting to viewport as window"),n=a(b));var o=n.height(),p=n.width(),q=n[0].toString();if(n[0]!==b&&"[object Window]"!==q&&"[object DOMWindow]"!==q){var r=n[0].getBoundingClientRect();h-=r.top,i-=r.top,j-=r.left,k-=r.left,d.scrollBarWidth=d.scrollBarWidth||c(n),p-=d.scrollBarWidth}return l.tolerance=~~Math.round(parseFloat(l.tolerance)),l.tolerance<0&&(l.tolerance=o+l.tolerance),0>=k||j>=p?m:m=l.tolerance?h<=l.tolerance&&i>=l.tolerance:i>0&&o>=h}String.prototype.hasOwnProperty("trim")||(String.prototype.trim=function(){return this.replace(/^\s*(.*?)\s*$/,"$1")});var e=function(b){if(1===arguments.length&&"function"==typeof b&&(b=[b]),!(b instanceof Array))throw new SyntaxError("isInViewport: Argument(s) passed to .do/.run should be a function or an array of functions");for(var c=0;c<b.length;c++)if("function"==typeof b[c])for(var d=0;d<this.length;d++)b[c].call(a(this[d]));else console.warn("isInViewport: Argument(s) passed to .do/.run should be a function or an array of functions"),console.warn("isInViewport: Ignoring non-function values in array and moving on");return this};a.fn["do"]=function(a){return console.warn("isInViewport: .do is deprecated as it causes issues in IE and some browsers since it's a reserved word. Use $.fn.run instead i.e., $(el).run(fn)."),e(a)},a.fn.run=e;var f=function(b){if(b){var c=b.split(",");return 1===c.length&&isNaN(c[0])&&(c[1]=c[0],c[0]=void 0),{tolerance:c[0]?c[0].trim():void 0,viewport:c[1]?a(c[1].trim()):void 0}}return{}};a.extend(a.expr[":"],{"in-viewport":a.expr.createPseudo?a.expr.createPseudo(function(a){return function(b){return d(b,f(a))}}):function(a,b,c){return d(a,f(c[3]))}}),a.fn.isInViewport=function(a){return this.filter(function(b,c){return d(c,a)})}}(jQuery,window);/*!
* jQuery Cookie Plugin v1.3.1
* https://github.com/carhartl/jquery-cookie
*
* Copyright 2013 Klaus Hartl
* Released under the MIT license
*/(function(factory){if(typeof define==='function'&&define.amd){define(['jquery'],factory);}else{factory(jQuery);}}(function($){var pluses=/\+/g;function decode(s){if(config.raw){return s;}
try{return decodeURIComponent(s.replace(pluses,' '));}catch(e){}}
function decodeAndParse(s){if(s.indexOf('"')===0){s=s.slice(1,-1).replace(/\\"/g,'"').replace(/\\\\/g,'\\');}
s=decode(s);try{return config.json?JSON.parse(s):s;}catch(e){}}
var config=$.cookie=function(key,value,options){if(value!==undefined){options=$.extend({},config.defaults,options);if(typeof options.expires==='number'){var days=options.expires,t=options.expires=new Date();t.setDate(t.getDate()+days);}
value=config.json?JSON.stringify(value):String(value);return(document.cookie=[config.raw?key:encodeURIComponent(key),'=',config.raw?value:encodeURIComponent(value),options.expires?'; expires='+options.expires.toUTCString():'',options.path?'; path='+options.path:'',options.domain?'; domain='+options.domain:'',options.secure?'; secure':''].join(''));}
var result=key?undefined:{};var cookies=document.cookie?document.cookie.split('; '):[];for(var i=0,l=cookies.length;i<l;i++){var parts=cookies[i].split('=');var name=decode(parts.shift());var cookie=parts.join('=');if(key&&key===name){result=decodeAndParse(cookie);break;}
if(!key&&(cookie=decodeAndParse(cookie))!==undefined){result[name]=cookie;}}
return result;};config.defaults={};$.removeCookie=function(key,options){if($.cookie(key)!==undefined){$.cookie(key,'',$.extend({},options,{expires:-1}));return true;}
return false;};}));/*!
* FitVids 1.1
*
* Copyright 2013, Chris Coyier - http://css-tricks.com + Dave Rupert - http://daverupert.com
* Credit to Thierry Koblentz - http://www.alistapart.com/articles/creating-intrinsic-ratios-for-video/
* Released under the WTFPL license - http://sam.zoy.org/wtfpl/
*
*/(function($){"use strict";$.fn.fitVids=function(options){var settings={customSelector:null};if(!document.getElementById('fit-vids-style')){var head=document.head||document.getElementsByTagName('head')[0];var css='.fluid-width-video-wrapper{width:100%;position:relative;padding:0;}.fluid-width-video-wrapper iframe,.fluid-width-video-wrapper object,.fluid-width-video-wrapper embed {position:absolute;top:0;left:0;width:100%;height:100%;}';var div=document.createElement('div');div.innerHTML='<p>x</p><style id="fit-vids-style">'+css+'</style>';head.appendChild(div.childNodes[1]);}
if(options){$.extend(settings,options);}
return this.each(function(){var selectors=["iframe[src*='player.vimeo.com']","iframe[src*='youtube.com']","iframe[src*='vine.co']","iframe[src*='youtube-nocookie.com']","iframe[src*='kickstarter.com'][src*='video.html']","object","embed"];if(settings.customSelector){selectors.push(settings.customSelector);}
var $allVideos=$(this).find(selectors.join(','));$allVideos=$allVideos.not("object object");$allVideos.each(function(){var $this=$(this);if(this.tagName.toLowerCase()==='embed'&&$this.parent('object').length||$this.parent('.fluid-width-video-wrapper').length){return;}
var height=(this.tagName.toLowerCase()==='object'||($this.attr('height')&&!isNaN(parseInt($this.attr('height'),10))))?parseInt($this.attr('height'),10):$this.height(),width=!isNaN(parseInt($this.attr('width'),10))?parseInt($this.attr('width'),10):$this.width(),aspectRatio=height/width;if(!$this.attr('id')){var videoID='fitvid'+Math.floor(Math.random()*999999);$this.attr('id',videoID);}
$this.wrap('<div class="fluid-width-video-wrapper"></div>').parent('.fluid-width-video-wrapper').css('padding-top',(aspectRatio*100)+"%");$this.removeAttr('height').removeAttr('width');});});};})(window.jQuery||window.Zepto);/*!
* hoverIntent r7 // 2013.03.11 // jQuery 1.9.1+
* http://cherne.net/brian/resources/jquery.hoverIntent.html
*
* You may use hoverIntent under the terms of the MIT license. Basically that
* means you are free to use hoverIntent as long as this header is left intact.
* Copyright 2007, 2013 Brian Cherne
*/(function($){$.fn.hoverIntent=function(handlerIn,handlerOut,selector){var cfg={interval:100,sensitivity:7,timeout:0};if(typeof handlerIn==="object"){cfg=$.extend(cfg,handlerIn);}else if($.isFunction(handlerOut)){cfg=$.extend(cfg,{over:handlerIn,out:handlerOut,selector:selector});}else{cfg=$.extend(cfg,{over:handlerIn,out:handlerIn,selector:handlerOut});}
var cX,cY,pX,pY;var track=function(ev){cX=ev.pageX;cY=ev.pageY;};var compare=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);if((Math.abs(pX-cX)+Math.abs(pY-cY))<cfg.sensitivity){$(ob).off("mousemove.hoverIntent",track);ob.hoverIntent_s=1;return cfg.over.apply(ob,[ev]);}else{pX=cX;pY=cY;ob.hoverIntent_t=setTimeout(function(){compare(ev,ob);},cfg.interval);}};var delay=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);ob.hoverIntent_s=0;return cfg.out.apply(ob,[ev]);};var handleHover=function(e){var ev=jQuery.extend({},e);var ob=this;if(ob.hoverIntent_t){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);}
if(e.type=="mouseenter"){pX=ev.pageX;pY=ev.pageY;$(ob).on("mousemove.hoverIntent",track);if(ob.hoverIntent_s!=1){ob.hoverIntent_t=setTimeout(function(){compare(ev,ob);},cfg.interval);}}else{$(ob).off("mousemove.hoverIntent",track);if(ob.hoverIntent_s==1){ob.hoverIntent_t=setTimeout(function(){delay(ev,ob);},cfg.timeout);}}};return this.on({'mouseenter.hoverIntent':handleHover,'mouseleave.hoverIntent':handleHover},cfg.selector);};})(jQuery);/*!
* jQuery UI Widget-factory plugin boilerplate (for 1.8/9+)
* Licensed under the MIT license
*/(function($,window,document,undefined){$.wildCart={'tldn':location.host.replace('learn','www').replace('forums','www'),'wildCartServer':'http'+(window.location.protocol==='https:'?'s':'')+'://'+location.host.replace('learn','www').replace('forums','www')+'/api/wildCart.php','cart':{},'cart_totals':{},'cart_subscribers':Array(),updateCart:function(data){this.cart=data['cart'];this.cart_count=data['cart_count'];this.updateCartTotals();if(data.full_cart&&data.full_cart.totals){for(var ti=0;ti<data.full_cart.totals.length;ti++){var tiStr=data.full_cart.totals[ti]['tag'];this.cart_totals[tiStr]=parseFloat(data.full_cart.totals[ti]['value']);}}
for(var index in this.cart_subscribers){_self=this.cart_subscribers[index];_self.options.cartUpdated.call(_self.element,{'cart':this.cart,'cart_totals':this.cart_totals,'carrot_text':data['full_cart']['carrot_text'],'carrot_class':data['full_cart']['carrot_class']});}
$.cookie('wishlist',data['wishlist'],{path:'/',domain:$.wildCart.tldn.replace('www','')});},updateCartTotals:function(){this.cart_totals['items']=this.cart_count;$.cookie('cart_count',this.cart_count,{path:'/',domain:$.wildCart.tldn.replace('www','')});}};$.widget("wildCart.addToCart",{options:{qty:1,success_template:'Added to cart!',return_full_cart:0,onAdded:function(data){alert('You need to set an onAdded callback function for this element!');},updateCart:function(event,cart){$.wildCart.updateCart(cart);if(window.shoppingCart){window.shoppingCart.refreshCart(cart);}},cartUpdated:function(data){alert('you need to create a cartUpdated callback to bind to this element');}},_create:function(){$.wildCart.cart_subscribers.push(this);this.options.pid=this.element.data("pid");this.options.multi_add=this.element.data("multi-add");if(typeof this.element.data("qty-source")!=='undefined'){this.options.qty=$(this.element.data("qty-source")).val();}
else if(typeof this.element.data("qty")!=='undefined'){this.options.qty=this.element.data("qty");}
if(typeof this.element.data("price")!=='undefined'){this.options.price=this.element.data("price");}
this.options.source_page=this.element.data("source-name");this.options.guide_id=this.element.data("guide-id");var self=this;self.element.click(function(e){if("withCredentials"in new XMLHttpRequest()){self._ajaxAdd(self.options.onAdded);e.stopPropagation();e.preventDefault();}});},destroy:function(){$.Widget.prototype.destroy.call(this);},_ajaxAdd:function(onSuccess){var self=this;if(typeof this.element.data("qty-source")!=='undefined'){this.options.qty=$(this.element.data("qty-source")).val();}
CartModel.addToCart(this.options.pid,this.options.qty,this.options.price).then(function(data){if(typeof window.shoppingCart!=='undefined'){window.shoppingCart._refreshCart(data);}});},_setOption:function(key,value){switch(key){default:break;}
$.Widget.prototype._setOption.apply(this,arguments);}});$.widget("wildCart.shoppingCartTag",{options:{cartUpdated:function(){alert('you need to create a cartUpdated callback to bind to this element');}},_create:function(){$.wildCart.cart_subscribers.push(this);},destroy:function(){$.Widget.prototype.destroy.call(this);},_setOption:function(key,value){switch(key){default:break;}
$.Widget.prototype._setOption.apply(this,arguments);}});})(jQuery,window,document);;(function(){var undefined;var VERSION='4.17.4';var FUNC_ERROR_TEXT='Expected a function';var NAN=0/0;var nullTag='[object Null]',symbolTag='[object Symbol]',undefinedTag='[object Undefined]';var reTrim=/^\s+|\s+$/g;var reIsBadHex=/^[-+]0x[0-9a-f]+$/i;var reIsBinary=/^0b[01]+$/i;var reIsOctal=/^0o[0-7]+$/i;var freeParseInt=parseInt;var freeGlobal=typeof global=='object'&&global&&global.Object===Object&&global;var freeSelf=typeof self=='object'&&self&&self.Object===Object&&self;var root=freeGlobal||freeSelf||Function('return this')();var freeExports=typeof exports=='object'&&exports&&!exports.nodeType&&exports;var freeModule=freeExports&&typeof module=='object'&&module&&!module.nodeType&&module;var objectProto=Object.prototype;var hasOwnProperty=objectProto.hasOwnProperty;var nativeObjectToString=objectProto.toString;var Symbol=root.Symbol,symToStringTag=Symbol?Symbol.toStringTag:undefined;var nativeMax=Math.max,nativeMin=Math.min;var realNames={};function lodash(){}
function baseGetTag(value){if(value==null){return value===undefined?undefinedTag:nullTag;}
return(symToStringTag&&symToStringTag in Object(value))?getRawTag(value):objectToString(value);}
function getRawTag(value){var isOwn=hasOwnProperty.call(value,symToStringTag),tag=value[symToStringTag];try{value[symToStringTag]=undefined;var unmasked=true;}catch(e){}
var result=nativeObjectToString.call(value);if(unmasked){if(isOwn){value[symToStringTag]=tag;}else{delete value[symToStringTag];}}
return result;}
function objectToString(value){return nativeObjectToString.call(value);}
var now=function(){return root.Date.now();};function debounce(func,wait,options){var lastArgs,lastThis,maxWait,result,timerId,lastCallTime,lastInvokeTime=0,leading=false,maxing=false,trailing=true;if(typeof func!='function'){throw new TypeError(FUNC_ERROR_TEXT);}
wait=toNumber(wait)||0;if(isObject(options)){leading=!!options.leading;maxing='maxWait'in options;maxWait=maxing?nativeMax(toNumber(options.maxWait)||0,wait):maxWait;trailing='trailing'in options?!!options.trailing:trailing;}
function invokeFunc(time){var args=lastArgs,thisArg=lastThis;lastArgs=lastThis=undefined;lastInvokeTime=time;result=func.apply(thisArg,args);return result;}
function leadingEdge(time){lastInvokeTime=time;timerId=setTimeout(timerExpired,wait);return leading?invokeFunc(time):result;}
function remainingWait(time){var timeSinceLastCall=time-lastCallTime,timeSinceLastInvoke=time-lastInvokeTime,result=wait-timeSinceLastCall;return maxing?nativeMin(result,maxWait-timeSinceLastInvoke):result;}
function shouldInvoke(time){var timeSinceLastCall=time-lastCallTime,timeSinceLastInvoke=time-lastInvokeTime;return(lastCallTime===undefined||(timeSinceLastCall>=wait)||(timeSinceLastCall<0)||(maxing&&timeSinceLastInvoke>=maxWait));}
function timerExpired(){var time=now();if(shouldInvoke(time)){return trailingEdge(time);}
timerId=setTimeout(timerExpired,remainingWait(time));}
function trailingEdge(time){timerId=undefined;if(trailing&&lastArgs){return invokeFunc(time);}
lastArgs=lastThis=undefined;return result;}
function cancel(){if(timerId!==undefined){clearTimeout(timerId);}
lastInvokeTime=0;lastArgs=lastCallTime=lastThis=timerId=undefined;}
function flush(){return timerId===undefined?result:trailingEdge(now());}
function debounced(){var time=now(),isInvoking=shouldInvoke(time);lastArgs=arguments;lastThis=this;lastCallTime=time;if(isInvoking){if(timerId===undefined){return leadingEdge(lastCallTime);}
if(maxing){timerId=setTimeout(timerExpired,wait);return invokeFunc(lastCallTime);}}
if(timerId===undefined){timerId=setTimeout(timerExpired,wait);}
return result;}
debounced.cancel=cancel;debounced.flush=flush;return debounced;}
function throttle(func,wait,options){var leading=true,trailing=true;if(typeof func!='function'){throw new TypeError(FUNC_ERROR_TEXT);}
if(isObject(options)){leading='leading'in options?!!options.leading:leading;trailing='trailing'in options?!!options.trailing:trailing;}
return debounce(func,wait,{'leading':leading,'maxWait':wait,'trailing':trailing});}
function isObject(value){var type=typeof value;return value!=null&&(type=='object'||type=='function');}
function isObjectLike(value){return value!=null&&typeof value=='object';}
function isSymbol(value){return typeof value=='symbol'||(isObjectLike(value)&&baseGetTag(value)==symbolTag);}
function toNumber(value){if(typeof value=='number'){return value;}
if(isSymbol(value)){return NAN;}
if(isObject(value)){var other=typeof value.valueOf=='function'?value.valueOf():value;value=isObject(other)?(other+''):other;}
if(typeof value!='string'){return value===0?value:+value;}
value=value.replace(reTrim,'');var isBinary=reIsBinary.test(value);return(isBinary||reIsOctal.test(value))?freeParseInt(value.slice(2),isBinary?2:8):(reIsBadHex.test(value)?NAN:+value);}
lodash.debounce=debounce;lodash.throttle=throttle;lodash.isObject=isObject;lodash.isObjectLike=isObjectLike;lodash.isSymbol=isSymbol;lodash.now=now;lodash.toNumber=toNumber;lodash.VERSION=VERSION;if(typeof define=='function'&&typeof define.amd=='object'&&define.amd){root._=lodash;define(function(){return lodash;});}
else if(freeModule){(freeModule.exports=lodash)._=lodash;freeExports._=lodash;}
else{root._=lodash;}}.call(this));var exports={};(function(){if(typeof window.CustomEvent==="function")return false;function CustomEvent(event,params){var p=params||{bubbles:false,cancelable:false,detail:undefined};var evt=document.createEvent('CustomEvent');evt.initCustomEvent(event,p.bubbles,p.cancelable,p.detail);return evt;}
CustomEvent.prototype=window.Event.prototype;window.CustomEvent=CustomEvent;})();(function(root){var setTimeoutFunc=setTimeout;function noop(){}
function bind(fn,thisArg){return function(){fn.apply(thisArg,arguments);};}
function Promise(fn){if(typeof this!=='object')throw new TypeError('Promises must be constructed via new');if(typeof fn!=='function')throw new TypeError('not a function');this._state=0;this._handled=false;this._value=undefined;this._deferreds=[];doResolve(fn,this);}
function handle(self,deferred){while(self._state===3){self=self._value;}
if(self._state===0){self._deferreds.push(deferred);return;}
self._handled=true;Promise._immediateFn(function(){var cb=self._state===1?deferred.onFulfilled:deferred.onRejected;if(cb===null){(self._state===1?resolve:reject)(deferred.promise,self._value);return;}
var ret;try{ret=cb(self._value);}catch(e){reject(deferred.promise,e);return;}
resolve(deferred.promise,ret);});}
function resolve(self,newValue){try{if(newValue===self)throw new TypeError('A promise cannot be resolved with itself.');if(newValue&&(typeof newValue==='object'||typeof newValue==='function')){var then=newValue.then;if(newValue instanceof Promise){self._state=3;self._value=newValue;finale(self);return;}else if(typeof then==='function'){doResolve(bind(then,newValue),self);return;}}
self._state=1;self._value=newValue;finale(self);}catch(e){reject(self,e);}}
function reject(self,newValue){self._state=2;self._value=newValue;finale(self);}
function finale(self){if(self._state===2&&self._deferreds.length===0){Promise._immediateFn(function(){if(!self._handled){Promise._unhandledRejectionFn(self._value);}});}
for(var i=0,len=self._deferreds.length;i<len;i++){handle(self,self._deferreds[i]);}
self._deferreds=null;}
function Handler(onFulfilled,onRejected,promise){this.onFulfilled=typeof onFulfilled==='function'?onFulfilled:null;this.onRejected=typeof onRejected==='function'?onRejected:null;this.promise=promise;}
function doResolve(fn,self){var done=false;try{fn(function(value){if(done)return;done=true;resolve(self,value);},function(reason){if(done)return;done=true;reject(self,reason);});}catch(ex){if(done)return;done=true;reject(self,ex);}}
Promise.prototype['catch']=function(onRejected){return this.then(null,onRejected);};Promise.prototype.then=function(onFulfilled,onRejected){var prom=new(this.constructor)(noop);handle(this,new Handler(onFulfilled,onRejected,prom));return prom;};Promise.all=function(arr){var args=Array.prototype.slice.call(arr);return new Promise(function(resolve,reject){if(args.length===0)return resolve([]);var remaining=args.length;function res(i,val){try{if(val&&(typeof val==='object'||typeof val==='function')){var then=val.then;if(typeof then==='function'){then.call(val,function(val){res(i,val);},reject);return;}}
args[i]=val;if(--remaining===0){resolve(args);}}catch(ex){reject(ex);}}
for(var i=0;i<args.length;i++){res(i,args[i]);}});};Promise.resolve=function(value){if(value&&typeof value==='object'&&value.constructor===Promise){return value;}
return new Promise(function(resolve){resolve(value);});};Promise.reject=function(value){return new Promise(function(resolve,reject){reject(value);});};Promise.race=function(values){return new Promise(function(resolve,reject){for(var i=0,len=values.length;i<len;i++){values[i].then(resolve,reject);}});};Promise._immediateFn=(typeof setImmediate==='function'&&function(fn){setImmediate(fn);})||function(fn){setTimeoutFunc(fn,0);};Promise._unhandledRejectionFn=function _unhandledRejectionFn(err){if(typeof console!=='undefined'&&console){console.warn('Possible Unhandled Promise Rejection:',err);}};Promise._setImmediateFn=function _setImmediateFn(fn){Promise._immediateFn=fn;};Promise._setUnhandledRejectionFn=function _setUnhandledRejectionFn(fn){Promise._unhandledRejectionFn=fn;};if(typeof module!=='undefined'&&module.exports){module.exports=Promise;}else if(!root.Promise){root.Promise=Promise;}})(this);