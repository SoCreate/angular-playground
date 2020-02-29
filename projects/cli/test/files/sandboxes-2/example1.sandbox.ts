export default sandboxOf(ExampleComponent, {
    imports: [ReactiveFormsModule]
})
    .add('Default', {
        template: `<app-example></app-example>`
    })
    .add('With Wrapper', {
        template: `
            <div>
                <app-example></app-example>
            </div>
        `
    });
