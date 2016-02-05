@script ExecuteInEditMode()
var crosshair : Texture2D;

function OnGUI () {
	var w = crosshair.width/2;
	var h = crosshair.height/2;
	position = Rect((Screen.width - w)/2,(Screen.height - h )/2, w, h);

	if (!Input.GetButton ("Fire2")) { 
		GUI.DrawTexture(position, crosshair);
	}
}	