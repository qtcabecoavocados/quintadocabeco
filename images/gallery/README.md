# Gallery photos

Each folder below matches a tab on the **Gallery** page. Drop the photos for
that area into its folder, then the images can be wired into `gallery.html`.

Order (as shown on the site):

1. `facade/`
2. `kitchen/`
3. `common-area/`
4. `room-1/`
5. `room-2/`
6. `room-3/`
7. `room-4/`
8. `bathrooms/`
9. `laundry-room/`
10. `pool-area/`
11. `property/`

## How to add a photo
Put an image file in the right folder (e.g. `facade/front-door.jpg`), then in
`gallery.html` replace a placeholder tile inside that category's grid with:

```html
<figure class="g"><img src="images/gallery/facade/front-door.jpg" alt="Facade"></figure>
```

Tips: use `.jpg` and keep the longest side around 1600px for fast loading.
Once you've added photos, tell Claude and they can be wired in for you.
