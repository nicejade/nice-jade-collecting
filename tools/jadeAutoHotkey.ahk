;Notes: #==win !==Alt 2015-05-20  ^==Ctr  +==shift

;=========================================================================
#j::Run www.jeffjade.com
#b::Run https://www.baidu.com/
#g::Run https://www.google.com/
#y::Run http://www.cnblogs.com/jadeboy/
#0::Run https://tinypng.com/
#v::Run https://www.v2ex.com/
;-------------------------------------------------------------------------

^!d:: ;Ctrl+alt+d
FormatTime, now_date, %A_Now%, yyyy-MM-dd hh:mm
Send, % now_date 
Return

::/dd::
d = %A_YYYY%-%A_MM%-%A_DD% %A_Hour%:%A_Min%:%A_Sec%
t = Date: 
clipboard = %t% %d%
Send ^v
return

!n::run notepad
!c::run, D:\SoftwareKit\_jade_new_soft\cmd_markdown_win64\Cmd Markdown.exe
!r::run, D:\SoftWarePackage\cmder_mini\Cmder.exe
!Down::run, D:\SoftWarePackage\Sublime Text Build 3114 x64\sublime_text.exe
;==========================================================================


;一键拷贝文件路径
;==========================================================================
^+c::
; null= 
send ^c
sleep,200
clipboard=%clipboard% ;%null%
tooltip,%clipboard%
sleep,500
tooltip,
return
;==========================================================================


;改掉大写键为Enter
;==========================================================================
;replace CapsLock to LeftEnter; CapsLock = Alt CapsLock
$CapsLock::Enter

LAlt & Capslock::SetCapsLockState, % GetKeyState("CapsLock", "T") ? "Off" : "On"

!u::Send ^c !{tab} ^v
;==========================================================================


;缩写快速打出常用语
;==========================================================================
::/mail::gmail@gmail.com
::/jeff::http://www.jeffjade.com/
::/con::console.log();
::/js::javascript:;
::/fk::轩先生这会子肯定在忙，请骚后。thx。祝君：天天开心，日日欣悦。
;==========================================================================


;颜色神偷
;==========================================================================
#c::
MouseGetPos, mouseX, mouseY
; 获得鼠标所在坐标，把鼠标的 X 坐标赋值给变量 mouseX ，同理 mouseY
PixelGetColor, color, %mouseX%, %mouseY%, RGB
; 调用 PixelGetColor 函数，获得鼠标所在坐标的 RGB 值，并赋值给 color
StringRight color,color,6
; 截取 color（第二个 color）右边的6个字符，因为获得的值是这样的：#RRGGBB，一般我们只需要 RRGGBB 部分。把截取到的值再赋给 color（第一个 color）。
clipboard = %color%
; 把 color 的值发送到剪贴板
return
;==========================================================================
