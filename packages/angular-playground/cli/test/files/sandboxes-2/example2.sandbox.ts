export default sandboxOf(Example2Component, {
    imports: [],
    declarations: [],
    label: 'test'
})
    .add('Other', {
        template: `<app-example-02></app-example-02>`
    })
    // .add('Commented out', {
    //     template: `<app-example></app-example>`
    // })
    .add('An other!', {
        template: `<app-example-02></app-example-02>`
    });
