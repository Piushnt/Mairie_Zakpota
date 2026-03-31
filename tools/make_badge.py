import sys
from PIL import Image

def create_badge(input_path, output_path):
    print(f"Opening {input_path}")
    img = Image.open(input_path).convert("RGBA")
    
    # Get data
    datas = img.getdata()
    
    newData = []
    # Badge should be pure white on transparent
    for item in datas:
        # Check if the pixel is near-white (background)
        # item is (R, G, B, A)
        if item[0] > 240 and item[1] > 240 and item[2] > 240:
            # White background -> transparent
            newData.append((255, 255, 255, 0))
        else:
            # Non-white part of the logo -> solid white
            newData.append((255, 255, 255, 255))
            
    img.putdata(newData)
    
    # Resize the badge to exactly 96x96 for notifications, using Nearest Neighbor or Bilinear
    img = img.resize((96, 96), Image.Resampling.LANCZOS)
    
    print(f"Saving badge to {output_path}")
    img.save(output_path, "PNG")

if __name__ == "__main__":
    input_file = r"c:\Users\HNT\Desktop\Mairie_Zakpota\public\img\logo-mairie.jpg"
    output_file = r"c:\Users\HNT\Desktop\Mairie_Zakpota\public\badge.png"
    create_badge(input_file, output_file)
