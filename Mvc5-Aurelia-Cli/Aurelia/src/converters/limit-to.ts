export class LimitToValueConverter{
    toView(value: string, length: number) {
        if(value.length < length) {
            return value;
        }
        
        return value.substr(0, length);
    }
}